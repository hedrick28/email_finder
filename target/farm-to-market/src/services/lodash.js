import _ from "lodash";
const camelCaseToWords = (s) => {
  return _.startCase(_.words(s).join(" "));
};

export default camelCaseToWords;
