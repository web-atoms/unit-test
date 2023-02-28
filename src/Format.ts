const prefix = (n: number, m: number = 2) => {
    let s = n.toString();
    m -= s.length;
    while(m > 0) {
        m--;
        s = "0" + s;
    }
    return s;
};

export const formatSeconds = (n) =>  (n / 1000).toFixed(2);

export const formatTime = (n) => {
    let milliseconds = n % 1000;
    let seconds = n / 1000;
    let minutes = seconds / 60;
    seconds = seconds % 60;
    let hours = minutes / 60;
    minutes = minutes % 60;
    var t = prefix(Math.floor(hours)) + ":" + prefix(Math.floor(minutes)) + ":" + prefix(Math.floor(seconds));
    if (milliseconds) {
        t += "." + Math.floor(milliseconds);
    }
    return t;
};
