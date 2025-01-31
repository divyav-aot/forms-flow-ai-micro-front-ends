import React from "react";
import ReactDOMServer from 'react-dom/server';
import impoundAtom from "../component/impoundLotOperators_VI_StageOne.json";
import {  formsPNG } from "../component/printHelperServices"; 
import { SVGprint } from "../component/svgPrint";
import inputValues from "../component/sampleData_VI_24Hour_StageTwo.json"

  
class PrintServices {
  renderSVGForm(values, componentSettings, isEditMode, builderMode) {    
    values = inputValues;
    let renderStage = componentSettings["stage"] || "stageOne";

    let isPreview = isEditMode;
    if(!isPreview && builderMode){
      isPreview = true;
    }    

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
              isPreview={isPreview} 
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
