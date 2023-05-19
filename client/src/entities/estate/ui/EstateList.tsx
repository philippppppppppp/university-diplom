import { ChangeEvent, FC, Fragment, useEffect } from "react";
import {
  Flex,
  Select,
  Popover,
  PopoverTrigger,
  Button,
  PopoverContent,
  PopoverBody,
  PopoverArrow,
  Checkbox,
  Box,
  Slide,
  useColorMode,
  Show,
} from "@chakra-ui/react";
import { useEstateInfiniteList } from "../hooks";
import { useTranslation } from "../../../shared/translations";
import { Formik, Form, FormikHelpers } from "formik";
import {
  Container,
  FormInput,
  FormSubmit,
  Loader,
  LoadingError,
} from "../../../shared/ui";
import { useBooleanFilter, useFilter } from "../../../shared/filtersService";
import { useAuth } from "../../../shared/auth";
import { useInView } from "react-intersection-observer";
import { ListItem } from "./components/ListItem";

interface PriceFilter {
  from: string;
  to: string;
}

export const EstateList: FC = () => {
  const { t } = useTranslation();
  const { userId, authenticated, notAuthenticatedAfterInitialRefresh } =
    useAuth();
  const { ref: loadMoreRef, inView: loadMoreInView } = useInView();
  const { ref: filtersRef, inView: filtersInView } = useInView();
  const { colorMode } = useColorMode();

  const [type, setType] = useFilter("type");
  const [rooms, setRooms] = useFilter("rooms");
  const [priceFrom, setPriceFrom] = useFilter("priceFrom");
  const [priceTo, setPriceTo] = useFilter("priceTo");
  const priceInitial: PriceFilter = {
    from: priceFrom,
    to: priceTo,
  };
  const [userAdsOnly, setUserAdsOnly] = useBooleanFilter("userAdsOnly");

  const {
    data: infiniteData,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isError,
  } = useEstateInfiniteList({
    type,
    rooms,
    priceFrom: priceFrom,
    priceTo: priceTo,
    authorId: userAdsOnly ? userId : null,
  });

  useEffect(() => {
    if (loadMoreInView) {
      fetchNextPage();
    }
  }, [loadMoreInView, fetchNextPage]);

  useEffect(() => {
    if (notAuthenticatedAfterInitialRefresh) {
      setUserAdsOnly(false);
    }
  }, [setUserAdsOnly, notAuthenticatedAfterInitialRefresh]);

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

  const renderFilters = () => (
    <>
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
    </>
  );

  return (
    <>
      <Flex pb="4" gap="4" wrap="wrap" ref={filtersRef}>
        {renderFilters()}
      </Flex>
      <Show above="md">
        <Box zIndex="1" left="0" right="0" top="0" pos="fixed">
          <Slide direction="top" in={!filtersInView}>
            <Flex
              gap="4"
              wrap="wrap"
              as={Container}
              rounded="md"
              shadow="md"
              bgColor={colorMode === "dark" ? "gray.600" : "gray.100"}
            >
              {renderFilters()}
            </Flex>
          </Slide>
        </Box>
      </Show>
      <Flex gap="4" direction="column">
        {infiniteData?.pages.map(({ data, nextOffset }) => (
          <Fragment key={nextOffset}>
            {data.map((item) => (
              <ListItem {...item} key={item.id} />
            ))}
          </Fragment>
        ))}
        {!isLoading && hasNextPage && (
          <Box ref={loadMoreRef}>
            <Loader />
          </Box>
        )}
      </Flex>
    </>
  );
};
