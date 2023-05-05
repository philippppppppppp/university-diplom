import { FC, useState } from "react";
import {
  Box,
  Card as CardUi,
  CardBody,
  Flex,
  Heading,
  Stack,
  Text,
  Image,
  CardFooter,
  Select,
  Spinner,
  Popover,
  PopoverTrigger,
  Button,
  PopoverContent,
  PopoverBody,
  PopoverArrow,
} from "@chakra-ui/react";
import { useEstateList, EstateItem, EstateType, EstateRooms } from "../hooks";
import { Link } from "react-router-dom";
import { useTranslation } from "../../../shared/translations";
import { Formik, Form } from "formik";
import { FormInput } from "../../../shared/ui";

type CardProps = EstateItem;

const Card: FC<CardProps> = ({
  id,
  images,
  title,
  description,
  address,
  priceUAH,
  createdAt,
  areaM2,
  rooms,
}) => {
  const { t } = useTranslation();
  return (
    <CardUi
      direction={{ md: "row", base: "column" }}
      cursor="pointer"
      as={Link}
      to={`/estate/${id}`}
      overflow="hidden"
    >
      <Image
        maxW={{ md: "400px", base: "100%" }}
        maxH={{ md: "auto", base: "350px" }}
        objectFit="cover"
        src={images?.[0]}
      />
      <Stack>
        <CardBody>
          <Text pb="1">{priceUAH} ₴</Text>
          <Heading size="md">{title}</Heading>
          {!!address && <Text py="2">{address}</Text>}
          {!!description && <Text py="2">{description}</Text>}
          <Text py="2">
            {t("rooms")}: {rooms}, {t("area")}: {areaM2}м²
          </Text>
        </CardBody>
        <CardFooter>
          <Text>
            {t("published")}: {new Date(createdAt).toLocaleDateString()}
          </Text>
        </CardFooter>
      </Stack>
    </CardUi>
  );
};

const priceInitial = {
  from: "",
  to: "",
};

export const EstateList: FC = () => {
  const { t } = useTranslation();
  const [type, setType] = useState<EstateType | null>(null);
  const [rooms, setRooms] = useState<EstateRooms | null>(null);
  const [price, setPrice] = useState<{
    from: null | number;
    to: null | number;
  }>({ from: null, to: null });
  const { data, isLoading, isSuccess } = useEstateList({
    type,
    rooms,
    priceFrom: price.from,
    priceTo: price.to,
  });

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (!value) {
      setType(null);
      return;
    }
    setType(value as EstateType);
  };

  const handleRoomsChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (!value) {
      setRooms(null);
      return;
    }
    const numberOfRooms = +value;
    setRooms(numberOfRooms as EstateRooms);
  };

  const handlePriceSubmit = ({ from, to }: typeof priceInitial) => {
    setPrice({ from: from === "" ? null : +from, to: to === "" ? null : +to });
  };

  return (
    <Box padding="2">
      <Flex pb="4" gap="4">
        <Select placeholder={t("type")} onChange={handleTypeChange}>
          <option value="flat">{t("flat")}</option>
          <option value="house">{t("house")}</option>
        </Select>
        <Select placeholder={t("rooms")} onChange={handleRoomsChange}>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4+</option>
        </Select>
        <Popover>
          <PopoverTrigger>
            <Button flexBasis="300px">{t("price")}</Button>
          </PopoverTrigger>
          <PopoverContent>
            <PopoverArrow />
            <PopoverBody>
              <Formik initialValues={priceInitial} onSubmit={handlePriceSubmit}>
                <Form>
                  <Flex direction="column" gap="2">
                    <FormInput
                      placeholder={t("from")}
                      type="number"
                      name="from"
                    />
                    <FormInput placeholder={t("to")} type="number" name="to" />
                    <Button type="submit">{t("apply")}</Button>
                  </Flex>
                </Form>
              </Formik>
            </PopoverBody>
          </PopoverContent>
        </Popover>
      </Flex>
      <Flex gap="4" direction="column">
        {isLoading && <Spinner alignSelf="center" />}
        {isSuccess && data.length > 0 ? (
          data!.map((item) => <Card {...item} key={item.id} />)
        ) : (
          <Text alignSelf="center">{t("noResult")}</Text>
        )}
      </Flex>
    </Box>
  );
};
