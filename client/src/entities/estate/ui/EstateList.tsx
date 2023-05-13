import { FC, useState } from "react";
import {
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
  Tag,
} from "@chakra-ui/react";
import { useEstateList, EstateItem } from "../hooks";
import { Link, useSearchParams } from "react-router-dom";
import { useTranslation } from "../../../shared/translations";
import { Formik, Form } from "formik";
import { FormInput } from "../../../shared/ui";
import { getPriceString } from "../../../shared/getPriceString";
import { getDateString } from "../../../shared/getDateString";

type CardProps = EstateItem;

const Card: FC<CardProps> = ({
  id,
  images,
  title,
  description,
  address,
  priceUAH,
  createdAt,
  livingAreaM2,
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
          <Text pb="1">{getPriceString(priceUAH)}</Text>
          <Heading size="md">{title}</Heading>
          <Text py="2">{address}</Text>
          {!!description && <Text py="2">{description}</Text>}
          <Flex py="2" gap="2">
            <Tag>
              {t("rooms")}: {rooms}
            </Tag>
            <Tag>
              {t("totalArea")}: {livingAreaM2}м²
            </Tag>
          </Flex>
        </CardBody>
        <CardFooter>
          <Text>
            {t("published")}: {getDateString(createdAt)}
          </Text>
        </CardFooter>
      </Stack>
    </CardUi>
  );
};

export const EstateList: FC = () => {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [type, setType] = useState<string>(searchParams.get("type") ?? "");
  const [rooms, setRooms] = useState<string>(searchParams.get("rooms") ?? "");
  const priceInitial = {
    from: searchParams.get("priceFrom") ?? "",
    to: searchParams.get("priceTo") ?? "",
  };
  const [price, setPrice] = useState<{
    from: string;
    to: string;
  }>(priceInitial);

  const { data, isLoading, isSuccess } = useEstateList({
    type,
    rooms,
    priceFrom: price.from,
    priceTo: price.to,
  });

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (!value) {
      setType("");
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        next.delete("type");
        return next;
      });
      return;
    }
    setType(value);
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set("type", value);
      return next;
    });
  };

  const handleRoomsChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (!value) {
      setRooms("");
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        next.delete("rooms");
        return next;
      });
      return;
    }
    setRooms(value);
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set("rooms", value);
      return next;
    });
  };

  const handlePriceSubmit = (price: typeof priceInitial) => {
    setPrice(price);
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (price.from === "") {
        next.delete("priceFrom");
      } else {
        next.set("priceFrom", price.from);
      }
      if (price.to === "") {
        next.delete("priceTo");
      } else {
        next.set("priceTo", price.to);
      }
      return next;
    });
    return;
  };

  return (
    <>
      <Flex pb="4" gap="4" wrap="wrap">
        <Select
          placeholder={t("type")}
          onChange={handleTypeChange}
          value={type}
          flex="150px 1 0"
        >
          <option value="flat">{t("flat")}</option>
          <option value="house">{t("house")}</option>
        </Select>
        <Select
          placeholder={t("rooms")}
          onChange={handleRoomsChange}
          value={rooms}
          flex="150px 1 0"
        >
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4+</option>
        </Select>
        <Popover>
          <PopoverTrigger>
            <Button flex="150px 1 0">{t("price")}</Button>
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
    </>
  );
};
