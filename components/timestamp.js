const timestamp_to_date = (timestamp) => {
    const date = new Date(timestamp);
    return date.toDateString();
  };

export default timestamp_to_date;