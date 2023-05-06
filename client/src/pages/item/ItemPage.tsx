import { useParams } from "react-router-dom";
import { Layout } from "../../shared/ui";
import { Header } from "../../widgets/header";
import { EstateItem } from "../../widgets/estate-item";

export const ItemPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <>
      <Header />
      <Layout>
        <EstateItem id={id} />
      </Layout>
    </>
  );
};
