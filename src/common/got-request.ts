import Got from "got";

import Config from "../common/config";

const got = Got.extend({
  prefixUrl: Config.domain,
  responseType: "json"
});

export default got;
