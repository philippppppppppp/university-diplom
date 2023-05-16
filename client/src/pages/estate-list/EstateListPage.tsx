import { EstateList } from "../../entities/estate";
import { BasicLayout } from "../../widgets/basic-layout";

export const EstateListPage: React.FC = () => {
  return (
    <BasicLayout>
      <EstateList />
    </BasicLayout>
  );
};
