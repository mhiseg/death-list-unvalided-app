import { getAsyncLifecycle, defineConfigSchema } from "@openmrs/esm-framework";
import { configSchema } from "./config-schema";

const importTranslation = require.context(
  "../translations",
  false, 
  /.json$/,
  "lazy"
);

const backendDependencies = {
  fhir2: "^1.2.0",
  "webservices.rest": "^2.2.0",
};


function setupOpenMRS() {
  const moduleName = "@mhiseg/mhiseg-list-unvalided-app";
  const options = {
    featureName: "",
    moduleName,
  };

  defineConfigSchema(moduleName, configSchema);

  return {
    pages: [
      {
        load: getAsyncLifecycle(() => import("./unvalided-deathList"), options),
        route: "death/list-unvalidate", 
      },
    ]
  };
}

export { backendDependencies, importTranslation, setupOpenMRS };
