function replacePartAndRedirect(oldPart, newPart) {
    const currentURL = window.location.href;
    if (currentURL.includes(oldPart)) {
        const newURL = currentURL.replace(oldPart, newPart);
        window.location.href = newURL;
    } else {
        console.error(`Фрагмент "${oldPart}" не найден в URL.`);
    }
}