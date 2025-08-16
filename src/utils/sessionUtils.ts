// Utility functions for session data formatting

export const formatDateTime = (dateString: string, timezone: string = 'UTC'): string => {
  try {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      day: 'numeric',
      month: 'long',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
      timeZone: timezone,
    };
    return date.toLocaleDateString('en-US', options);
  } catch (error) {
    return 'Invalid date';
  }
};

export const formatTimeRange = (
  startTime: string,
  endTime: string,
  timezone: string = 'UTC'
): string => {
  try {
    const start = new Date(startTime);
    const end = new Date(endTime);

    const timeOptions: Intl.DateTimeFormatOptions = {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
      timeZone: timezone,
    };

    const startTimeStr = start.toLocaleTimeString('en-US', timeOptions);
    const endTimeStr = end.toLocaleTimeString('en-US', timeOptions);

    return `${startTimeStr} - ${endTimeStr}`;
  } catch (error) {
    return 'Invalid time range';
  }
};

export const calculateDuration = (startTime: string, endTime: string): string => {
  try {
    const start = new Date(startTime);
    const end = new Date(endTime);
    const diffInMs = end.getTime() - start.getTime();
    const diffInHours = diffInMs / (1000 * 60 * 60);

    if (diffInHours < 1) {
      const diffInMinutes = Math.round(diffInMs / (1000 * 60));
      return `${diffInMinutes} Minutes`;
    } else if (diffInHours === 1) {
      return '1 Hour';
    } else {
      return `${Math.round(diffInHours)} Hours`;
    }
  } catch (error) {
    return '1 Hour'; // Default fallback
  }
};

export const getTimeUntilSession = (startTime: string): string => {
  try {
    const start = new Date(startTime);
    const now = new Date();
    const diffInMs = start.getTime() - now.getTime();

    if (diffInMs < 0) {
      return 'Session has started';
    }

    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInMinutes = Math.floor((diffInMs % (1000 * 60 * 60)) / (1000 * 60));

    if (diffInHours > 24) {
      const diffInDays = Math.floor(diffInHours / 24);
      return `Starting in ${diffInDays} days`;
    } else if (diffInHours > 0) {
      return `Starting in ${diffInHours} hours`;
    } else if (diffInMinutes > 0) {
      return `Starting in ${diffInMinutes} minutes`;
    } else {
      return 'Starting now';
    }
  } catch (error) {
    return 'Starting soon';
  }
};

export const formatTimezone = (timezone: string): string => {
  const timezoneMap: { [key: string]: string } = {
    UTC: 'UTC',
    EST: 'Eastern Time',
    PST: 'Pacific Time',
    CST: 'Central Time',
    MST: 'Mountain Time',
    GMT: 'Greenwich Mean Time',
  };

  return timezoneMap[timezone] || timezone;
};

export const getSessionStatus = (
  startTime: string,
  endTime: string
): { status: string; color: string } => {
  try {
    const now = new Date();
    const start = new Date(startTime);
    const end = new Date(endTime);

    if (now < start) {
      return { status: 'Upcoming', color: '#39A340' };
    } else if (now >= start && now <= end) {
      return { status: 'In Progress', color: '#FFA500' };
    } else {
      return { status: 'Completed', color: '#6B7280' };
    }
  } catch (error) {
    return { status: 'Unknown', color: '#6B7280' };
  }
};
