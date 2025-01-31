import moment from "moment-timezone";
import twentyFourHourDriverform from "../assets/MV2634E_082023_driver.png";
import twentyFourHourILOform from "../assets/MV2634E_082023_ilo.png";
import twentyFourHourPoliceform from "../assets/MV2634E_082023_icbc.png";
import viDriverForm from "../assets/MV2721_202404.png";
import viIncidentDetails from "../assets/MV2722_202404_Incident_Details.png";
import appealsForm from "../assets/MV2721_202404_appeal.png";
import viReportForm from "../assets/MV2722_202404.png";
import twelveHourDriverForm from "../assets/MV2906E_082023_driver.png";
import twelveHourICBCForm from "../assets/MV2906E_082023_icbc.png";



export const formsPNG = {
  stageOne: {
    TwentyFourHour: {
      DRIVER: { png: twentyFourHourDriverform, aspectClass: "--landscape" },
      ILO: { png: twentyFourHourILOform, aspectClass: "--landscape" },
    },
    TwelveHour: {
      DRIVER: { png: twelveHourDriverForm, aspectClass: "--landscape" },
    },
    VI: {
      DRIVER: { png: viDriverForm, aspectClass: "--portrait" },
      APPEAL: { png: appealsForm, aspectClass: "--portrait" },
      ILO: { png: viDriverForm, aspectClass: "--portrait" },
    },
  },
  stageTwo: {
    TwentyFourHour: {
      POLICE: { png: twentyFourHourPoliceform, aspectClass: "--landscape" },
    },
    TwelveHour: {
      POLICE: { png: twelveHourICBCForm, aspectClass: "--landscape" },
    },
    VI: {
      POLICE: { png: viDriverForm, aspectClass: "--portrait" },
      REPORT: { png: viReportForm, aspectClass: "--portrait" },
      DETAILS: { png: viIncidentDetails, aspectClass: "--portrait" },
    },
  },
};

const fieldsToSplit = { VEHICLE_MAKE: 0, VEHICLE_MODEL: 1 };
export const printFormatHelper = (values, data, key, impoundLotOperators) => {
  let val = values[data["field_name"]];

  // if the value needs to be split into to fields

  if (key in fieldsToSplit) {
    const splitData =
      typeof values[data["field_name"]] === "object"
        ? values[data["field_name"]]["value"].split(data["delimeter"])
        : values[data["field_name"]].split(data["delimeter"]);
    // if the value only needs the first part split off then rejoin the rest
    val =
      typeof fieldsToSplit[key] === "number"
        ? splitData[fieldsToSplit[key]]
        : splitData.splice(1).join(data["delimeter"]);
    return val;
  }

  //if the field on the form is expecting more than one value join them together
  if (Array.isArray(data["field_name"])) {
    val = "";
    data["field_name"].forEach((value, index) => {
      if (values[data["field_name"][index]]) {
        if (typeof values[data["field_name"][index]] === "object") {
          if (value === "offence_city") {
            val += values[data["field_name"][index]]["label"];
          } else if (value === "driver_prov_state") {
            if (values[data["field_name"][index]]["value"].includes("_")) {
              val += values[data["field_name"][index]]["value"].split("_")[1];
            } else {
              val += values[data["field_name"][index]]["value"];
            }
          } else {
            val += values[data["field_name"][index]]["value"];
          }
        } else {
          val += values[data["field_name"][index]];
        }
        if (data["field_name"].length > index + 1) {
          val += ", ";
        }
      }
    });

    // Add province to location of DL surrender
    if (key === "DL_SURRENDER_LOCATION") {
      val = val + ", BC";
    }

    // For registered owner, if owned by corp, display corp name instead of owner name
    if (key === "OWNER_NAME") {
      if (values["owned_by_corp"]) {
        val = values["corporation_name"];
      }
    }

    return val;
  }

  // If the value is a barcode
  if (data["barcode"]) {
    // Strip the prefix characters
    val = "*" + val.toString().slice(2) + "*";
  }

  //if the value is a date
  if (
    Object.prototype.toString.call(values[data["field_name"]]) ===
    "[object Date]"
  ) {
    if (data["date_val"]) {
      val = moment(values[data["field_name"]]).format(data["date_val"]);
    } else {
      val = moment(values[data["field_name"]]).format("YYYY-MM-DD");
    }
    return val;
  }
  //if the value is a list join them into a single string
  if (Array.isArray(values[data["field_name"]])) {
    val = values[data["field_name"]].join("");
    return val;
  }

  if (key === "DRIVER_DL_EXPIRY") {
    if (values["driver_licence_expiry"]) {
      val = moment(values["driver_licence_expiry"]).format("YYYY");
      return val;
    }
  }

  if (key === "REPORT_DRIVER_DL_EXPIRY") {
    if (values["out_of_province_dl_expiry"]) {
      val = moment(values["out_of_province_dl_expiry"]).format("YYYY");
      return val;
    }
  }

  //temp: if the value is an object then take its value
  if (
    values[data["field_name"]] &&
    typeof values[data["field_name"]] === "object"
  ) {
    if (key === "LOCATION_CITY") {
      val = val["label"];
    } else {
      val = values[data["field_name"]]["value"];
      String(val).includes("_")
        ? (val = values[data["field_name"]]["value"].split("_")[1])
        : (val = values[data["field_name"]]["value"]);
    }
    return val;
  }
  let released_val = "";
  if (values["TwelveHour"]) {
    released_val = "vehicle_location";
  } else if (values["TwentyFourHour"]) {
    released_val = "reason_for_not_impounding";
  }
  if (key === "NOT_IMPOUNDED_REASON") {
    switch (values[released_val]) {
      case "released":
        val = "RELEASED TO OTHER DRIVER";
        break;
      case "private":
        val = "PRIVATE TOW";
        break;
      case "roadside":
        val = "LEFT AT ROADSIDE";
        break;
      case "investigation":
        val = "SEIZED FOR INVESTIGATION";
        break;
      default:
        val = "";
    }
  }

  if (key === "RELEASE_LOCATION_VEHICLE") {
    if (
      values["VI"] ||
      (values["TwentyFourHour"] && values["vehicle_impounded"] === "YES")
    ) {
      val = "IMPOUNDED";
    } else {
      switch (values[released_val]) {
        case "released":
          val = "RELEASED TO OTHER DRIVER";
          break;
        case "private":
          val = "PRIVATE TOW";
          break;
        case "roadside":
          val = "LEFT AT ROADSIDE";
          break;
        case "investigation":
          val = "SEIZED FOR INVESTIGATION";
          break;
        default:
          val = "";
      }
    }
  }

  if (key === "RELEASE_LOCATION_KEYS") {
    if (
      values["VI"] ||
      (values["TwentyFourHour"] && values["vehicle_impounded"] === "YES")
    ) {
      val = values["location_of_keys"];
    } else {
      switch (values[released_val]) {
        case "released":
          val = "WITH OTHER DRIVER";
          break;
        case "private":
          val = values["location_of_keys"];
          break;
        case "roadside":
          val = values["location_of_keys"];
          break;
        default:
          val = "";
      }
    }
  }

  if (key === "RELEASE_PERSON") {
    if (
      values["VI"] ||
      (values["TwentyFourHour"] && values["vehicle_impounded"] === "YES")
    ) {
      val = "";
    } else {
      switch (values[released_val]) {
        case "released":
          val = values["vehicle_released_to"];
          break;
        case "private":
          val = values["ILO-name"];
          break;
        case "roadside":
          val = "";
          break;
        default:
          val = "";
      }
    }
  }

  if (key === "RELEASE_DATE") {
    if (values["VI"]) {
      // val = moment(values["date_of_impound"]).format("YYYY-MM-DD");
    }
  }

  if (values["incident_details"] && values["incident_details"].length > 0) {
    values["incident_details_explained_below"] = true;
  }

  // Split into two fields
  if (key === "REPORT_INCIDENT_DETAILS") {
    if (values["incident_details"] && values["incident_details"].length > 500) {
      val = values["incident_details"].substring(0, 500);
      // values["extra_page_flag"] = true;
      // console.log("extra page flag", values["extra_page_flag"]);
    }
  }

  if (key === "DETAILS_INCIDENT_DETAILS") {
    if (values["incident_details"] && values["incident_details"].length > 500) {
      val = values["incident_details"].substring(500);
      // values["extra_page_flag"] = true;
      // console.log("extra page flag", values["extra_page_flag"]);
    }
  }

  if (
    key === "IMPOUND_LOT_NAME" ||
    key === "IMPOUNDED_LOT" ||
    (key === "RELEASE_PERSON" &&
      values["TwelveHour"] &&
      !values["VI"] &&
      values["vehicle_location"] === "private")
  ) {
    const tmp = impoundLotOperators.filter(
      (x) => x["name"] === values["ILO-name"]
    )[0];
    if (tmp && tmp.name_print) {
      val = tmp.name_print;
    } else {
      val = values["ILO-name"];
    }
  }

  return val;
};


export const printCheckHelper = (values, data, key) => {
  //if value is boolean just return it
  if (typeof values[data["field_name"]] === "boolean") {
    if (data["field_val"] === "false") {
      return !values[data["field_name"]];
    }
    return values[data["field_name"]];
  }

  if (Array.isArray(data["field_val"])) {
    if (data["field_val"].includes(values[data["field_name"]])) {
      return true;
    }
  }
  //if value is a string check to see that it matches what is expected
  if (values[data["field_name"]] === data["field_val"]) {
    return true;
  }
  return false;
};