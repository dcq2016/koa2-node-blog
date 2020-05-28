function toDate(getTime) {
    var date = new Date(parseInt(getTime));
    var time = date.getFullYear() + '-' + (date.getMonth()+1) + '-' + date.getDate() +' '+ date.getHours()+':'+ date.getMinutes() +':'+ date.getSeconds();
    return time;
}