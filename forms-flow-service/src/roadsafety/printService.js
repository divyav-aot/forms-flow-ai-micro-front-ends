import React from "react";
import ReactDOMServer from 'react-dom/server';
import inputValues from "./renderData_VI_24Hour_StageOne.json";
import impoundAtom from "./impoundLotOperators_VI_StageOne.json";
import {  formsPNG } from "./helpers";
import { SVGprint } from "./svgPrint";

  
class PrintServices {
  renderSVGForm(values, renderStage){
    values = inputValues["values"];
    renderStage = inputValues["renderStage"];
    const forms = {
      TwentyFourHour: values["TwentyFourHour"],
      TwelveHour: values["TwelveHour"],
      // IRP: values["IRP"],
      VI: values["VI"],
    };
    const valuesCopy = { ...values };
    if (values["vehicle_impounded"] === "YES") {
      valuesCopy["date_released"] = null;
      valuesCopy["time_released"] = null;
      // break;
    }
    const componentsToRender = [];
    for (const item in forms) {
      if (forms[item]) {
        for (const form in formsPNG[renderStage][item]) {
          if (
            form === "ILO" &&
            values["VI"] &&
            values["TwentyFourHour"] &&
            item === "TwentyFourHour"
          ) {
            break;
          }
          if (form === "ILO" && values["vehicle_impounded"] === "NO") {
            break;
          }
          // if (form === "ILO" && values["vehicle_impounded"] === "YES") {
          //   values['date_released']=null
          //   values['time_released']=null
          //   break;
          // }

          // We don't need an extra page if our incident details will fit on the first.
          if (form === "DETAILS" && values["incident_details"].length < 500) {
            break;
          }
          const svgString = ReactDOMServer.renderToString(
            <SVGprint
              key={item + form}
              form={formsPNG[renderStage][item][form]["png"]}
              formAspect={formsPNG[renderStage][item][form]["aspectClass"]}
              formLayout={item}
              formType={form}
              values={valuesCopy}
              impoundLotOperators={impoundAtom}
              renderStage={renderStage}
            />
          );

          // Push the rendered HTML string (SVG content) to the componentsToRender array
          componentsToRender.push(svgString);
        }        
      }
    }
    return componentsToRender;
  }    
}

 
  
  window.printServices = new PrintServices();
  
  export default PrintServices;
  