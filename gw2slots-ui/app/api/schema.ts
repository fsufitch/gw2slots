export interface UserResponseData {
  username: string;
  created_on_unix_sec: number;
  balance: number;
  api_key: string;
  game_name: string;
  permissions: {[key: string]: boolean};
}
