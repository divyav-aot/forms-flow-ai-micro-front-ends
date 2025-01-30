import React from "react";
import ReactDOMServer from 'react-dom/server';
import inputValues from "./renderData_VI_24Hour_StageOne.json";
import impoundAtom from "./impoundLotOperators_VI_StageOne.json";
import {  formsPNG } from "./helpers";
import { SVGprint } from "./svgPrint";

  
class PrintServices {
  renderSVGForm(values, componentSettings) {
    console.log("Component Settings:", JSON.stringify(componentSettings, null, 2));

    values = inputValues["values"];
    let renderStage = componentSettings["stage"] || "stageOne";

    // Detect if it's Preview Mode (e.g., if `id` or `defaultValue` is empty)
    const isPreview = !componentSettings.id || componentSettings.defaultValue === null;

    const forms = {
      TwentyFourHour: values["TwentyFourHour"],
      TwelveHour: values["TwelveHour"],
      VI: values["VI"],
    };

    const valuesCopy = { ...values };
    if (values["vehicle_impounded"] === "YES") {
      valuesCopy["date_released"] = null;
      valuesCopy["time_released"] = null;
    }

    const componentsToRender = [];
    for (const item in forms) {
      if (forms[item]) {
        for (const form in formsPNG[renderStage][item]) {
          if (form === "ILO" && values["VI"] && values["TwentyFourHour"] && item === "TwentyFourHour") {
            break;
          }
          if (form === "ILO" && values["vehicle_impounded"] === "NO") {
            break;
          }
          if (form === "DETAILS" && values["incident_details"].length < 500) {
            break;
          }

          const svg = (
            <SVGprint
              key={item + form}
              form={formsPNG[renderStage][item][form]["png"]}
              formAspect={formsPNG[renderStage][item][form]["aspectClass"]}
              formLayout={item}
              formType={form}
              values={valuesCopy}
              impoundLotOperators={impoundAtom}
              renderStage={renderStage}
              isPreview={isPreview} // <-- Pass this flag to SVGprint
            />
          );

          componentsToRender.push(svg);
        }
      }
    }
    return componentsToRender;
  }
}

export default PrintServices;
