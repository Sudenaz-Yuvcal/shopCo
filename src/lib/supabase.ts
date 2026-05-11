import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://hiuexmdsywexwzreebkm.supabase.co";

const supabaseKey = "sb_publishable_MSvNayYI_OaX7z6Z4jr18Q_Tvb2QXYM";

export const supabase = createClient(supabaseUrl, supabaseKey);

