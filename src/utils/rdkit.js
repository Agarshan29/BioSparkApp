let rdkitLoadingPromise = null;

export const getRDKit = () => {
  if (!rdkitLoadingPromise) {
    rdkitLoadingPromise = new Promise((resolve, reject) => {
      window.initRDKitModule()
        .then(RDKit => {
          window.RDKit = RDKit;
          resolve(RDKit);
        })
        .catch(reject);
    });
  }

  return rdkitLoadingPromise;
};