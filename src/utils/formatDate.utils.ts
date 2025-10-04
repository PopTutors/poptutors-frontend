export const formatDate = (dateString: string): string => {
    if (!dateString) return '';

    // Handle common formats
    const cleanDate = dateString.trim().toLowerCase();

    // If it's already in a good format, return as is (but capitalize)
    if (cleanDate === 'present') return 'Present';

    // Try to parse and format various date inputs
    try {
        // Check if it's an ISO date string (like 2025-05-31T18:30:00.000Z)
        if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z?$/i.test(dateString) ||
            /^\d{4}-\d{2}-\d{2}$/i.test(dateString)) {
            const date = new Date(dateString);
            if (!isNaN(date.getTime())) {
                const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                const month = months[date.getMonth()];
                const year = date.getFullYear();
                return `${month}${year}`;
            }
        }

        // Handle "Jun 2025" format - just capitalize and remove spaces
        if (/^[a-z]{3}\s*\d{4}$/i.test(cleanDate)) {
            return cleanDate.replace(/\s+/g, '').replace(/^[a-z]{3}/i, match =>
                match.charAt(0).toUpperCase() + match.slice(1).toLowerCase()
            );
        }

        // Handle "june 2025" format - convert to "Jun2025"
        const months = {
            january: 'Jan', february: 'Feb', march: 'Mar', april: 'Apr',
            may: 'May', june: 'Jun', july: 'Jul', august: 'Aug',
            september: 'Sep', october: 'Oct', november: 'Nov', december: 'Dec'
        };

        for (const [fullMonth, shortMonth] of Object.entries(months)) {
            if (cleanDate.includes(fullMonth)) {
                return cleanDate.replace(fullMonth, shortMonth).replace(/\s+/g, '');
            }
        }

        // If it contains numbers, try to format it
        const yearMatch = dateString.match(/\d{4}/);
        const monthMatch = dateString.match(/[a-z]{3,}/i);

        if (yearMatch && monthMatch) {
            const month = monthMatch[0].charAt(0).toUpperCase() + monthMatch[0].slice(1, 3).toLowerCase();
            return `${month}${yearMatch[0]}`;
        }

        // Return original if no pattern matches, but capitalize first letter
        return dateString.charAt(0).toUpperCase() + " " + dateString.slice(1);

    } catch (error) {
        // If parsing fails, return the original string with first letter capitalized
        return dateString.charAt(0).toUpperCase() + " " + dateString.slice(1);
    }
};
