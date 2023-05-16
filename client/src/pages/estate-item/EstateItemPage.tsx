import { useParams } from "react-router-dom";
import { BasicLayout } from "../../widgets/basic-layout";
import { EstateItem } from "../../widgets/estate-item";

export const EstateItemPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <BasicLayout>
      <EstateItem id={id!} />
    </BasicLayout>
  );
};
