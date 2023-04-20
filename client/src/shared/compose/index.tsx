import { FC, PropsWithChildren } from "react";

interface Props {
  components: Array<React.JSXElementConstructor<React.PropsWithChildren<any>>>;
}

export const Compose: FC<PropsWithChildren<Props>> = (props) => {
  const { components = [], children } = props;

  return (
    <>
      {components.reduceRight((acc, C) => {
        return <C>{acc}</C>;
      }, children)}
    </>
  );
};
