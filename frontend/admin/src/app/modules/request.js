import Request from 'core/request';
import {getRestUrl} from 'modules/app';
Request = new Request({
  url: getRestUrl('/wp-json/spotter'),
});
export default Request;