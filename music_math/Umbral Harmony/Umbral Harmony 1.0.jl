# ═══ Core Math (BigInt Precision) ═══

normalize(r::Rational) = r * (1//2)^floor(Int, log2(r))
normalize_scale(s) = sort!(unique!(normalize.(s)))

# Вычисляет "разрешение сетки" (Global LCM) для всей системы
function system_resolution(system)
    denoms = (denominator(n) for s in system for n in s.scale)
    reduce(lcm, denoms; init=BigInt(1))
end

# ═══ The Analyst ═══

# Находит знаменатель, удаление которого максимально упростит систему.
# Эвристика "Stem Pruning": при прочих равных удаляем большие числа (шум),
# оставляя малые (структуру).
function identify_noise(system)
    denoms = unique(denominator(n) for s in system for n in s.scale)
    sort!(denoms, rev=true) # Сортировка по убыванию критически важна!

    # Ищем 'd', без которого LCM оставшихся будет минимальным
    argmin(denoms) do d
        d == 1 ? BigInt(typemax(Int128)) : lcm(filter(!=(d), denoms))
    end
end

# ═══ The Sculptor ═══

function sculpt_system(system, max_resolution::Integer; min_size=3)
    current_res = system_resolution(system)
    
    # Если мы вписались в сетку — работа окончена
    current_res <= max_resolution && return system

    # Иначе находим и удаляем "шум"
    noise = identify_noise(system)
    
    refined = map(system) do s
        (root=s.root, scale=filter(n -> denominator(n) != noise, s.scale))
    end
    
    # Рекурсия с очисткой пустых ладов
    sculpt_system(filter(s -> length(s.scale) >= min_size, refined), max_resolution; min_size)
end

# ═══ The Projector (Entry Point) ═══

function generate_system(; max_resolution=2520, pool_size=32, min_notes=3)
    # 1. Проекция: Создаем "глыбу" всех возможных унтертонов
    raw_matter = [
        (root=anchor, scale=BigInt(anchor) .// BigInt.(1:pool_size)) 
        for anchor in 1:pool_size
    ]
    
    # 2. Скульптура: Отсекаем всё лишнее
    sculpt_system(raw_matter, max_resolution; min_size=min_notes)
end

# ═══ Visualization ═══

const VIEWS = Dict(
    :relative => (s, h_root) -> normalize_scale(s.scale ./ s.root) .* normalize(s.root // 1),
    :harmonic => (s, h_root) -> normalize_scale(s.scale ./ h_root),
    :absolute => (s, h_root) -> normalize_scale(s.scale)
)

function print_report(; limit=360, view=:relative)
    system = generate_system(max_resolution=limit)
    h_root = 1 // system_resolution(system) # Fundamental = 1 / LCM
    
    println("\n--- Polyundertonality v1.0 ---")
    println("Grid Resolution: $limit (System Fundamental: $h_root)")
    println("View Mode: :$view\n")
    
    transform = get(VIEWS, view, VIEWS[:relative])
    
    for s in system
        notes = transform(s, h_root)
        notes_str = join([string(n.num, "//", n.den) for n in notes], ", ")
        println("Anchor $(lpad(string(s.root), 2)) => [$notes_str]")
    end
end

print_report(limit=360, view=:relative)
print_report(limit=360, view=:harmonic)
print_report(limit=360, view=:normalized)


# julia> print_report(limit=360, view=:relative)

# --- Polyundertonality v1.0 ---
# Grid Resolution: 360 (System Fundamental: 1//60)
# View Mode: :relative

# Anchor  1 => [1//1, 4//3, 8//5]
# Anchor  2 => [1//1, 4//3, 8//5]
# Anchor  3 => [3//2, 8//5, 2//1, 12//5, 8//3]
# Anchor  4 => [1//1, 4//3, 8//5]
# Anchor  5 => [5//4, 4//3, 8//5, 5//3, 2//1]
# Anchor  6 => [3//2, 8//5, 2//1, 12//5, 8//3]
# Anchor  7 => [7//4, 2//1, 7//3, 8//3, 14//5]
# Anchor  8 => [1//1, 4//3, 8//5]
# Anchor  9 => [9//8, 6//5, 4//3, 3//2, 9//5, 2//1]
# Anchor 10 => [5//4, 4//3, 8//5, 5//3, 2//1]
# Anchor 11 => [11//8, 11//6, 2//1, 11//5]
# Anchor 12 => [3//2, 8//5, 2//1, 12//5, 8//3]
# Anchor 13 => [13//8, 2//1, 13//6, 13//5]
# Anchor 14 => [7//4, 2//1, 7//3, 8//3, 14//5]
# Anchor 15 => [15//8, 2//1, 12//5, 5//2, 3//1, 10//3]
# Anchor 16 => [1//1, 4//3, 8//5]
# Anchor 17 => [17//16, 17//12, 17//10, 2//1]
# Anchor 18 => [9//8, 6//5, 4//3, 3//2, 9//5, 2//1]
# Anchor 19 => [19//16, 19//12, 19//10, 2//1]
# Anchor 20 => [5//4, 4//3, 8//5, 5//3, 2//1]
# Anchor 21 => [21//16, 7//5, 3//2, 7//4, 2//1, 21//10, 7//3]
# Anchor 22 => [11//8, 11//6, 2//1, 11//5]
# Anchor 23 => [23//16, 23//12, 2//1, 23//10]
# Anchor 24 => [3//2, 8//5, 2//1, 12//5, 8//3]
# Anchor 25 => [25//16, 5//3, 2//1, 25//12, 5//2]
# Anchor 26 => [13//8, 2//1, 13//6, 13//5]
# Anchor 27 => [27//16, 9//5, 2//1, 9//4, 27//10, 3//1]
# Anchor 28 => [7//4, 2//1, 7//3, 8//3, 14//5]
# Anchor 29 => [29//16, 2//1, 29//12, 29//10]
# Anchor 30 => [15//8, 2//1, 12//5, 5//2, 3//1, 10//3]
# Anchor 31 => [31//16, 2//1, 31//12, 31//10]
# Anchor 32 => [1//1, 4//3, 8//5]

# julia> print_report(limit=360, view=:harmonic)

# --- Polyundertonality v1.0 ---
# Grid Resolution: 360 (System Fundamental: 1//60)
# View Mode: :harmonic

# Anchor  1 => [5//4, 3//2, 15//8]
# Anchor  2 => [5//4, 3//2, 15//8]
# Anchor  3 => [9//8, 5//4, 45//32, 3//2, 15//8]
# Anchor  4 => [5//4, 3//2, 15//8]
# Anchor  5 => [75//64, 5//4, 3//2, 25//16, 15//8]
# Anchor  6 => [9//8, 5//4, 45//32, 3//2, 15//8]
# Anchor  7 => [35//32, 5//4, 21//16, 105//64, 15//8]
# Anchor  8 => [5//4, 3//2, 15//8]
# Anchor  9 => [135//128, 9//8, 5//4, 45//32, 27//16, 15//8]
# Anchor 10 => [75//64, 5//4, 3//2, 25//16, 15//8]
# Anchor 11 => [33//32, 165//128, 55//32, 15//8]
# Anchor 12 => [9//8, 5//4, 45//32, 3//2, 15//8]
# Anchor 13 => [65//64, 39//32, 195//128, 15//8]
# Anchor 14 => [35//32, 5//4, 21//16, 105//64, 15//8]
# Anchor 15 => [9//8, 75//64, 45//32, 25//16, 225//128, 15//8]
# Anchor 16 => [5//4, 3//2, 15//8]
# Anchor 17 => [85//64, 51//32, 15//8, 255//128]
# Anchor 18 => [135//128, 9//8, 5//4, 45//32, 27//16, 15//8]
# Anchor 19 => [285//256, 95//64, 57//32, 15//8]
# Anchor 20 => [75//64, 5//4, 3//2, 25//16, 15//8]
# Anchor 21 => [35//32, 315//256, 21//16, 45//32, 105//64, 15//8, 63//32]
# Anchor 22 => [33//32, 165//128, 55//32, 15//8]
# Anchor 23 => [69//64, 345//256, 115//64, 15//8]
# Anchor 24 => [9//8, 5//4, 45//32, 3//2, 15//8]
# Anchor 25 => [75//64, 375//256, 25//16, 15//8, 125//64]
# Anchor 26 => [65//64, 39//32, 195//128, 15//8]
# Anchor 27 => [135//128, 81//64, 45//32, 405//256, 27//16, 15//8]
# Anchor 28 => [35//32, 5//4, 21//16, 105//64, 15//8]
# Anchor 29 => [145//128, 87//64, 435//256, 15//8]
# Anchor 30 => [9//8, 75//64, 45//32, 25//16, 225//128, 15//8]
# Anchor 31 => [155//128, 93//64, 465//256, 15//8]
# Anchor 32 => [5//4, 3//2, 15//8]

# julia> print_report(limit=360, view=:normalized)

# --- Polyundertonality v1.0 ---
# Grid Resolution: 360 (System Fundamental: 1//60)
# View Mode: :normalized

# Anchor  1 => [1//1, 4//3, 8//5]
# Anchor  2 => [1//1, 4//3, 8//5]
# Anchor  3 => [3//2, 8//5, 2//1, 12//5, 8//3]
# Anchor  4 => [1//1, 4//3, 8//5]
# Anchor  5 => [5//4, 4//3, 8//5, 5//3, 2//1]
# Anchor  6 => [3//2, 8//5, 2//1, 12//5, 8//3]
# Anchor  7 => [7//4, 2//1, 7//3, 8//3, 14//5]
# Anchor  8 => [1//1, 4//3, 8//5]
# Anchor  9 => [9//8, 6//5, 4//3, 3//2, 9//5, 2//1]
# Anchor 10 => [5//4, 4//3, 8//5, 5//3, 2//1]
# Anchor 11 => [11//8, 11//6, 2//1, 11//5]
# Anchor 12 => [3//2, 8//5, 2//1, 12//5, 8//3]
# Anchor 13 => [13//8, 2//1, 13//6, 13//5]
# Anchor 14 => [7//4, 2//1, 7//3, 8//3, 14//5]
# Anchor 15 => [15//8, 2//1, 12//5, 5//2, 3//1, 10//3]
# Anchor 16 => [1//1, 4//3, 8//5]
# Anchor 17 => [17//16, 17//12, 17//10, 2//1]
# Anchor 18 => [9//8, 6//5, 4//3, 3//2, 9//5, 2//1]
# Anchor 19 => [19//16, 19//12, 19//10, 2//1]
# Anchor 20 => [5//4, 4//3, 8//5, 5//3, 2//1]
# Anchor 21 => [21//16, 7//5, 3//2, 7//4, 2//1, 21//10, 7//3]
# Anchor 22 => [11//8, 11//6, 2//1, 11//5]
# Anchor 23 => [23//16, 23//12, 2//1, 23//10]
# Anchor 24 => [3//2, 8//5, 2//1, 12//5, 8//3]
# Anchor 25 => [25//16, 5//3, 2//1, 25//12, 5//2]
# Anchor 26 => [13//8, 2//1, 13//6, 13//5]
# Anchor 27 => [27//16, 9//5, 2//1, 9//4, 27//10, 3//1]
# Anchor 28 => [7//4, 2//1, 7//3, 8//3, 14//5]
# Anchor 29 => [29//16, 2//1, 29//12, 29//10]
# Anchor 30 => [15//8, 2//1, 12//5, 5//2, 3//1, 10//3]
# Anchor 31 => [31//16, 2//1, 31//12, 31//10]
# Anchor 32 => [1//1, 4//3, 8//5]