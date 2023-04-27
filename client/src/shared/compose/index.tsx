import { FC, PropsWithChildren, JSXElementConstructor } from "react";

interface Props {
  components: Array<JSXElementConstructor<PropsWithChildren<any>>>;
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
