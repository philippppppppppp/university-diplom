import { EstateFavoritesList } from "../../entities/estate";
import { BasicLayout } from "../../widgets/basic-layout";

export const EstateFavoritesListPage: React.FC = () => {
  return (
    <BasicLayout>
      <EstateFavoritesList />
    </BasicLayout>
  );
};
