export const formatMessageTimestamp = (timestamp: number): string => {
  const now = new Date();
  const messageDate = new Date(timestamp);
  const diffInHours =
    (now.getTime() - messageDate.getTime()) / (1000 * 60 * 60);

  if (diffInHours < 24) {
    return messageDate.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  } else {
    return messageDate.toLocaleDateString("en-CA");
  }
};
