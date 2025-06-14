export const formatDate = (date: string | Date): string => {
  return new Date(date).toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const formatTime = (time: string | Date): string => {
  // Jika input adalah Date object
  if (time instanceof Date) {
    return time.toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  // Jika input adalah string ISO format (dari backend)
  if (time.includes('T') && time.includes('Z')) {
    return new Date(time).toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  // Jika input adalah string time saja (HH:mm)
  if (time.match(/^\d{2}:\d{2}$/)) {
    return new Date(`2000-01-01T${time}`).toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  console.error('Invalid time format:', time);
  return '--:--';
};

export const formatDateTime = (dateTime: string | Date): string => {
  return new Date(dateTime).toLocaleString('id-ID', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const getStatusColor = (status: string): string => {
  switch (status) {
    case 'present':
      return 'success';
    case 'late':
      return 'warning';
    case 'absent':
      return 'danger';
    default:
      return 'default';
  }
};

export const capitalizeFirst = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};