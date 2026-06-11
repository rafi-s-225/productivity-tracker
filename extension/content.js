(function () {
  chrome.storage.local.get(['blocklist'], (result) => {
    const blocklist = result.blocklist || [];
    const currentDomain = window.location.hostname.replace('www.', '');

    if (blocklist.includes(currentDomain)) {
      window.location.replace(
        chrome.runtime.getURL('blocked.html') + '?site=' + currentDomain
      );
    }
  });
})();