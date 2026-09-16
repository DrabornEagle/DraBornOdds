import * as dkd_Router from 'expo-router';
import { dkd } from '../src/dkd-ui';
export default function dkd_NotFound(){return <dkd.Page><dkd.Empty dkd_title="Bu sayfa sahada yok" dkd_body="Ana sayfadan keşfe devam edebilirsin." dkd_action="Ana sayfaya dön" dkd_onPress={()=>dkd_Router.router.replace('/')}/></dkd.Page>;}
