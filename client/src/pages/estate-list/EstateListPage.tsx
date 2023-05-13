import { EstateList } from "../../entities/estate";
import { Layout } from "../../shared/ui";
import { Header } from "../../widgets/header";

export const EstateListPage: React.FC = () => {
  return (
    <>
      <Header />
      <Layout>
        <EstateList />
      </Layout>
    </>
  );
};
