export const registerNetworkMonitor = (onOffline, onOnline) => {
    window.addEventListener('offline', onOffline);
    window.addEventListener('online', onOnline);
};
