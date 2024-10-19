export const formatDate = (dateString) => {
    const options = {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "Asia/Kathmandu",
        hour12: true,
    };
    return new Intl.DateTimeFormat("en-US", options).format(new Date(dateString));
};