import { addLocaleData } from "react-intl";
import csData from "react-intl/locale-data/cs";
import enData from "react-intl/locale-data/en";

addLocaleData([...csData, ...enData]);
