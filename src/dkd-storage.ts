import { File as dkd_File, Paths as dkd_Paths } from 'expo-file-system';
const dkd_file = () => new dkd_File(dkd_Paths.document, 'dkd-drabornodds-demo.json');
export async function dkd_readStorage(): Promise<string | null> {
  const dkd_target = dkd_file();
  return dkd_target.exists ? dkd_target.text() : null;
}
export async function dkd_writeStorage(dkd_value: string): Promise<void> {
  const dkd_target = dkd_file();
  if (!dkd_target.exists) dkd_target.create({intermediates: true});
  dkd_target.write(dkd_value);
}
