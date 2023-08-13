export function closeModal(id: string) {
    const container = document.getElementById(id);
    if (container) {
        const close = container.querySelector('[aria-label="Close"]') as HTMLButtonElement;
        close.click();
    }
}
