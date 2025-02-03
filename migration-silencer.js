Hooks.once("ready", function () {
  const waitForElm = (selector, innerSelector, text) => {
    return new Promise(resolve => {
      if (
        document.querySelector(selector) &&
        document
          .querySelector(selector)
          .querySelector(innerSelector)
          .textContent.trim() === text
      ) {
        return resolve({
          elm: document.querySelector(selector),
          selector,
          innerSelector
        });
      }

      const observer = new MutationObserver(mutations => {
        if (
          document.querySelector(selector) &&
          document
            .querySelector(selector)
            .querySelector(innerSelector)
            .textContent.trim() === text
        ) {
          observer.disconnect();
          resolve({
            elm: document.querySelector(selector),
            selector,
            innerSelector
          });
        }
      });

      // If you get "parameter 1 is not of type 'Node'" error, see https://stackoverflow.com/a/77855838/492336
      observer.observe(document.body, {
        childList: true,
        subtree: true
      });
    });
  };
  waitForElm(".dialog", ".window-title", "Migration").then(
    ({ elm, selector, innerSelector }) => {
      const interval = window.setInterval(() => {
        elm.querySelector(".header-button.control.close").click();
        if (
          typeof document
            .querySelector(selector)
            ?.querySelector(innerSelector) === "undefined"
        ) {
          console.log("Migration Silencer | Closed Notice");
          window.clearInterval(interval);
        }
      }, 500);
    }
  );
});
