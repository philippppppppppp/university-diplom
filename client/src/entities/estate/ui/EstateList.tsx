import { ChangeEvent, FC, useEffect } from "react";
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
  Popover,
  PopoverTrigger,
  Button,
  PopoverContent,
  PopoverBody,
  PopoverArrow,
  Tag,
  Checkbox,
} from "@chakra-ui/react";
import { useEstateList, EstateListItem } from "../hooks";
import { Link } from "react-router-dom";
import { useTranslation } from "../../../shared/translations";
import { Formik, Form, FormikHelpers } from "formik";
import {
  FormInput,
  FormSubmit,
  Loader,
  LoadingError,
} from "../../../shared/ui";
import { getPriceString } from "../../../shared/getPriceString";
import { getDateString } from "../../../shared/getDateString";
import { useBooleanFilter, useFilter } from "../../../shared/filtersService";
import { useAuth } from "../../../shared/auth";

type CardProps = EstateListItem;

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

interface PriceFilter {
  from: string;
  to: string;
}

export const EstateList: FC = () => {
  const { t } = useTranslation();
  const { authenticated, loading, userId } = useAuth();
  const [type, setType] = useFilter("type");
  const [rooms, setRooms] = useFilter("rooms");
  const [priceFrom, setPriceFrom] = useFilter("priceFrom");
  const [priceTo, setPriceTo] = useFilter("priceTo");
  const [userAdsOnly, setUserAdsOnly] = useBooleanFilter("userAdsOnly");
  const priceInitial: PriceFilter = {
    from: priceFrom,
    to: priceTo,
  };

  const { data, isLoading, isError } = useEstateList({
    type,
    rooms,
    priceFrom: priceFrom,
    priceTo: priceTo,
    authorId: userAdsOnly ? userId : null,
  });

  useEffect(() => {
    if (!authenticated && !loading) {
      setUserAdsOnly(false);
    }
  }, [setUserAdsOnly, authenticated, loading]);

  if (isLoading) {
    return <Loader />;
  }

  if (isError) {
    return <LoadingError />;
  }

  const handleTypeChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setType(value);
  };

  const handleRoomsChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setRooms(value);
  };

  const handlePriceFilterChange = (
    { from, to }: PriceFilter,
    { setSubmitting }: FormikHelpers<PriceFilter>
  ) => {
    const formattedPrice = {
      from: String(from),
      to: String(to),
    };
    setPriceFrom(formattedPrice.from);
    setPriceTo(formattedPrice.to);
    setSubmitting(false);
  };

  const handleUserAdsOnlyFilterChange = (e: ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setUserAdsOnly(checked);
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
              <Formik
                initialValues={priceInitial}
                onSubmit={handlePriceFilterChange}
              >
                <Form>
                  <Flex direction="column" gap="2">
                    <FormInput
                      placeholder={t("from")}
                      type="number"
                      name="from"
                    />
                    <FormInput placeholder={t("to")} type="number" name="to" />
                    <FormSubmit>{t("apply")}</FormSubmit>
                  </Flex>
                </Form>
              </Formik>
            </PopoverBody>
          </PopoverContent>
        </Popover>
        {authenticated && (
          <Checkbox
            onChange={handleUserAdsOnlyFilterChange}
            checked={userAdsOnly}
            defaultChecked={userAdsOnly}
          >
            {t("userAdsOnly")}
          </Checkbox>
        )}
      </Flex>
      <Flex gap="4" direction="column">
        {data.length > 0 ? (
          data!.map((item) => <Card {...item} key={item.id} />)
        ) : (
          <Text alignSelf="center">{t("noResult")}</Text>
        )}
      </Flex>
    </>
  );
};
