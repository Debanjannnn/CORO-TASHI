export default function convertTimestampToDate(timestamp: number): string {
    const date = new Date(timestamp * 1000);
    return date.toLocaleString("en-US", {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
}