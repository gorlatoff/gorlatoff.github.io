#!/usr/bin/env python3
# applydiff_win.py — Windows-only минималистичный "patch" для unified diff
# Консольное приложение: можно просто вставить текст diff и завершить точкой на отдельной строке.
# Работает в папке, где лежит сам скрипт (root по умолчанию = каталог скрипта).
#
# Возможности:
# - Unified diff (---/+++; @@ хунки; + - ' ' строки)
# - Создание/удаление файлов через /dev/null
# - Сохранение стиля перевода строк; для новых файлов по умолчанию CRLF
# - Поддержка "\ No newline at end of file"
# - Игнорирование служебных строк git diff (diff --git, index, mode, rename ...)
# - Режимы игнорирования пробелов (--ignore-space-change, --ignore-whitespace)
# - Поиск позиции хунков с fuzz и окном поиска (--fuzz, --max-search)
#
# Использование (Windows):
#   1) Вставкой из буфера:
#        python applydiff_win.py
#        (вставьте unified diff)
#        затем введите на новой строке одиночную точку: .  и нажмите Enter
#        (или Ctrl+Z, затем Enter)
#   2) Из файла:
#        python applydiff_win.py change.diff -p 1
#   3) Через конвейер:
#        type change.diff | python applydiff_win.py --dry-run

import sys
import os
import argparse
import re
from typing import List, Tuple, Optional

HUNK_RE = re.compile(r"^@@ -(\d+)(?:,(\d+))? \+(\d+)(?:,(\d+))? @@")

# Тип строки хунка: (op, text, has_newline)
HunkLine = Tuple[str, str, bool]

class Hunk:
    def __init__(self, ostart, ocnt, nstart, ncnt, lines: List[HunkLine]):
        self.ostart = int(ostart)
        self.ocnt = int(ocnt) if ocnt is not None else 1
        self.nstart = int(nstart)
        self.ncnt = int(ncnt) if ncnt is not None else 1
        self.lines = lines

class FilePatch:
    def __init__(self, src: Optional[str], dst: Optional[str]):
        self.src = src
        self.dst = dst
        self.hunks: List[Hunk] = []

    @property
    def is_delete(self):
        return (self.dst or '').strip() == '/dev/null'

    @property
    def is_create(self):
        return (self.src or '').strip() == '/dev/null'

SKIP_PREFIXES = (
    'diff --git', 'index ', 'new file mode', 'deleted file mode', 'old mode', 'new mode',
    'similarity index', 'rename from', 'rename to', 'copy from', 'copy to'
)


def normalize_path(raw: Optional[str], strip: Optional[int]) -> Optional[str]:
    if raw is None:
        return None
    raw = raw.strip()
    if raw == '/dev/null':
        return '/dev/null'
    if '\t' in raw:
        raw = raw.split('\t', 1)[0]
    path = raw
    if strip is None:
        if path.startswith('a/') or path.startswith('b/'):
            path = path.split('/', 1)[1]
    else:
        for _ in range(strip):
            if '/' in path:
                path = path.split('/', 1)[1]
            else:
                path = ''
                break
    return path


def parse_diff(text: str) -> List[FilePatch]:
    lines = text.splitlines(keepends=False)
    patches: List[FilePatch] = []
    i = 0
    current: Optional[FilePatch] = None
    while i < len(lines):
        line = lines[i]
        if line.startswith(SKIP_PREFIXES):
            i += 1
            continue
        if line.startswith('Binary files ') or line.startswith('GIT binary patch'):
            raise ValueError('Бинарные патчи не поддерживаются')
        if line.startswith('--- '):
            src = line[4:]
            i += 1
            while i < len(lines) and not lines[i].startswith('+++ '):
                if lines[i].startswith(SKIP_PREFIXES) or lines[i].strip() == '':
                    i += 1
                    continue
                break
            if i >= len(lines) or not lines[i].startswith('+++ '):
                raise ValueError('Повреждённый diff: отсутствует +++ после ---')
            dst = lines[i][4:]
            current = FilePatch(src, dst)
            patches.append(current)
            i += 1
            while i < len(lines):
                if lines[i].startswith('@@ '):
                    m = HUNK_RE.match(lines[i])
                    if not m:
                        raise ValueError(f'Повреждённый заголовок хунка: {lines[i]}')
                    ostart, ocnt, nstart, ncnt = m.groups()
                    i += 1
                    h_lines: List[HunkLine] = []
                    last_index = -1
                    while i < len(lines):
                        l = lines[i]
                        if l.startswith('@@ ') or l.startswith('--- '):
                            break
                        if l.startswith(' ') or l.startswith('+') or l.startswith('-'):
                            h_lines.append((l[0], l[1:], True))
                            last_index = len(h_lines) - 1
                        elif l.startswith('\\ No newline at end of file'):
                            if last_index >= 0:
                                op, txt, _ = h_lines[last_index]
                                h_lines[last_index] = (op, txt, False)
                        else:
                            h_lines.append((' ', l, True))
                            last_index = len(h_lines) - 1
                        i += 1
                    current.hunks.append(Hunk(ostart, ocnt, nstart, ncnt, h_lines))
                elif lines[i].startswith('diff ') or lines[i].startswith(SKIP_PREFIXES):
                    i += 1
                elif lines[i].startswith('--- '):
                    break
                else:
                    i += 1
        else:
            i += 1
    return patches


def detect_eol_from_lines(orig_lines: List[str]) -> Optional[str]:
    for s in orig_lines:
        if s.endswith('\r\n'):
            return '\r\n'
        if s.endswith('\n'):
            return '\n'
        if s.endswith('\r'):
            return '\r'
    return None


def choose_new_file_eol(policy: str) -> str:
    if policy == 'lf':
        return '\n'
    if policy == 'crlf':
        return '\r\n'
    if policy == 'cr':
        return '\r'
    return '\r\n'  # Windows по умолчанию


def split_content_and_nl(s: str):
    if s.endswith('\r\n'):
        return s[:-2], True
    if s.endswith('\n'):
        return s[:-1], True
    if s.endswith('\r'):
        return s[:-1], True
    return s, False

class CmpMode:
    NONE = 0
    SPACE_CHANGE = 1
    WHITESPACE = 2


def normalize_for_cmp(s: str, mode: int) -> str:
    s = s.replace('\r', '')
    if mode == CmpMode.NONE:
        return s
    if mode == CmpMode.WHITESPACE:
        return ''.join(ch for ch in s if not ch.isspace())
    out = []
    prev_space = False
    for ch in s:
        if ch.isspace():
            if not prev_space:
                out.append(' ')
                prev_space = True
        else:
            out.append(ch)
            prev_space = False
    return ''.join(out).strip()


def hunk_matches_at(orig_lines: List[str], start_idx: int, h_lines: List[HunkLine], cmp_mode: int):
    idx = start_idx
    for op, txt, _has_nl in h_lines:
        if op == '+':
            continue
        if idx >= len(orig_lines):
            return False, start_idx
        content, _ = split_content_and_nl(orig_lines[idx])
        if normalize_for_cmp(content, cmp_mode) != normalize_for_cmp(txt, cmp_mode):
            return False, start_idx
        idx += 1
    return True, idx


def reduce_hunk_lines(h_lines: List[HunkLine], drop_left_ctx: int, drop_right_ctx: int) -> List[HunkLine]:
    if drop_left_ctx == 0 and drop_right_ctx == 0:
        return h_lines
    ctx_idx = [i for i, (op, _, _) in enumerate(h_lines) if op == ' ']
    to_drop = set()
    for k in range(min(drop_left_ctx, len(ctx_idx))):
        to_drop.add(ctx_idx[k])
    for k in range(1, min(drop_right_ctx, len(ctx_idx)) + 1):
        to_drop.add(ctx_idx[-k])
    return [hl for j, hl in enumerate(h_lines) if j not in to_drop]


def apply_hunks_to_lines(orig_lines: List[str], hunks: List[Hunk], eol_new_file: str, cmp_mode: int, fuzz: int, max_search: Optional[int]) -> List[str]:
    out: List[str] = []
    in_pos = 0
    eol = detect_eol_from_lines(orig_lines) or eol_new_file

    for h in hunks:
        header_pos = max(h.ostart - 1, 0)
        variants = [(0, 0)]
        for f in range(1, max(0, fuzz) + 1):
            for dl in range(0, f + 1):
                dr = f - dl
                variants.append((dl, dr))

        placed = False
        chosen_start = None
        chosen_end_after = None
        chosen_lines: List[HunkLine] = []

        start_search = in_pos
        stop_search = len(orig_lines)
        if max_search is not None:
            start_search = max(in_pos, header_pos - max_search)
            stop_search = min(len(orig_lines), header_pos + max_search)

        for dl, dr in variants:
            reduced = reduce_hunk_lines(h.lines, dl, dr)
            candidates = []
            if header_pos >= start_search and header_pos <= stop_search:
                candidates.append(header_pos)
            for cand in range(start_search, stop_search + 1):
                if cand == header_pos:
                    continue
                candidates.append(cand)
            for cand in candidates:
                ok, end_after = hunk_matches_at(orig_lines, cand, reduced, cmp_mode)
                if ok and cand >= in_pos:
                    placed = True
                    chosen_start = cand
                    chosen_end_after = end_after
                    chosen_lines = reduced
                    break
            if placed:
                break

        if not placed:
            raise ValueError('Не удалось сопоставить хунк (контекст слишком изменился)')

        while in_pos < chosen_start:
            out.append(orig_lines[in_pos])
            in_pos += 1

        idx = in_pos
        for op, txt, has_nl in chosen_lines:
            if op == ' ':
                out.append(orig_lines[idx])
                idx += 1
            elif op == '-':
                idx += 1
            elif op == '+':
                out.append(txt + (eol if has_nl else ''))
            else:
                raise ValueError(f'Неизвестная операция хунка: {op}')
        in_pos = idx

    while in_pos < len(orig_lines):
        out.append(orig_lines[in_pos])
        in_pos += 1

    return out


def read_text_source(diff_path: Optional[str]) -> str:
    if diff_path:
        with open(diff_path, 'r', encoding='utf-8') as f:
            return f.read()
    # Интерактивный ввод: Windows-дружественно — завершаем точкой / EOF / END
    try:
        is_tty = sys.stdin.isatty()
    except Exception:
        is_tty = False
    if is_tty:
        print('Вставьте unified diff ниже. Для завершения введите на новой строке: .  (точка) и нажмите Enter.\nАльтернатива: Ctrl+Z, затем Enter.', file=sys.stderr)
        buf = []
        while True:
            try:
                line = input()
            except EOFError:
                break
            # Сентинелы завершения
            if line in ('.', 'EOF', 'END'):
                break
            buf.append(line + '\n')
        return ''.join(buf)
    # Не TTY — читаем как есть (pipe)
    return sys.stdin.read()


def main():
    if os.name != 'nt':
        print('Этот вариант утилиты рассчитан на Windows (os.name == "nt").', file=sys.stderr)
        return 2

    script_dir = os.path.dirname(os.path.abspath(sys.argv[0]))

    ap = argparse.ArgumentParser(description='Применить unified diff к файлам в папке (Windows, интерактивная вставка текста).')
    ap.add_argument('diff', nargs='?', help='Файл с diff. Если не задан, можно вставить текст вручную.')
    ap.add_argument('-p', '--strip', type=int, default=None, help='Отбросить N компонентов пути (как patch -pN). По умолчанию авто a/ b/.')
    ap.add_argument('--dry-run', action='store_true', help='Сухой прогон: только проверка применимости, без записи файлов.')
    ap.add_argument('--root', default=script_dir, help='Корень применения. По умолчанию: папка, где лежит скрипт.')
    ap.add_argument('--eol', choices=['auto', 'lf', 'crlf', 'cr'], default='crlf', help='Перевод строк для новых файлов (по умолчанию CRLF).')
    ap.add_argument('--ignore-space-change', action='store_true', help='Игнорировать различия в количестве пробелов.')
    ap.add_argument('--ignore-whitespace', action='store_true', help='Игнорировать пробелы полностью при сопоставлении.')
    ap.add_argument('--fuzz', type=int, default=2, help='Допустимый fuzz (отброс контекста) при поиске позиции хунка.')
    ap.add_argument('--max-search', type=int, default=None, help='Ограничить окно поиска позиции хунка (в строках).')

    args = ap.parse_args()

    text = read_text_source(args.diff)

    try:
        patches = parse_diff(text)
    except Exception as e:
        print(f'Ошибка разбора diff: {e}', file=sys.stderr)
        return 1

    if not patches:
        print('Патчи не найдены. Убедитесь, что вы вставили unified diff и завершили ввод точкой (.) или Ctrl+Z, Enter.', file=sys.stderr)
        return 1

    class CmpMode:
        NONE = 0
        SPACE_CHANGE = 1
        WHITESPACE = 2

    cmp_mode = CmpMode.NONE
    if args.ignore_whitespace:
        cmp_mode = CmpMode.WHITESPACE
    elif args.ignore_space_change:
        cmp_mode = CmpMode.SPACE_CHANGE

    failures = 0
    for fp in patches:
        src = normalize_path(fp.src, args.strip)
        dst = normalize_path(fp.dst, args.strip)

        if fp.is_delete:
            target = src
            op = 'delete'
        elif fp.is_create:
            target = dst
            op = 'create'
        else:
            target = dst
            op = 'modify'

        if not target:
            print('[-] Пропуск патча без применимого пути (возможно, /dev/null и слишком большой -p).')
            continue

        full_path = os.path.join(args.root, target)

        if op == 'delete':
            if not os.path.exists(full_path):
                print(f'[skip] {target}: уже отсутствует')
                continue
            if args.dry_run:
                print(f'[dry-run] будет удалён {target}')
            else:
                os.remove(full_path)
                print(f'[ok] удалён {target}')
            continue

        if os.path.exists(full_path):
            with open(full_path, 'r', encoding='utf-8', newline='') as f:
                orig_lines = f.read().splitlines(keepends=True)
        else:
            orig_lines = []
            if not args.dry_run:
                os.makedirs(os.path.dirname(full_path) or '.', exist_ok=True)

        try:
            new_lines = apply_hunks_to_lines(
                orig_lines,
                fp.hunks,
                eol_new_file=choose_new_file_eol(args.eol if args.eol != 'auto' else 'crlf'),
                cmp_mode=cmp_mode,
                fuzz=args.fuzz,
                max_search=args.max_search,
            )
        except Exception as e:
            failures += 1
            print(f'[fail] {target}: {e}', file=sys.stderr)
            continue

        if args.dry_run:
            print(f'[dry-run] будет записан {target} ({len(orig_lines)} → {len(new_lines)} строк)')
        else:
            with open(full_path, 'w', encoding='utf-8', newline='') as f:
                f.writelines(new_lines)
            print(f'[ok] {op} {target} ({len(orig_lines)} → {len(new_lines)} строк)')

    return 0 if failures == 0 else 1


if __name__ == '__main__':
    sys.exit(main())
