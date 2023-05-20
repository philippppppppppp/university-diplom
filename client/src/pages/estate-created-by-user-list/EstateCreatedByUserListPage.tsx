import { EstateCreatedByUserList } from "../../entities/estate";
import { BasicLayout } from "../../widgets/basic-layout";

export const EstateCreatedByUserListPage: React.FC = () => {
  return (
    <BasicLayout>
      <EstateCreatedByUserList />
    </BasicLayout>
  );
};
