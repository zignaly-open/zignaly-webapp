import { useState, useEffect } from "react";
import tradeApi from "../services/tradeApiClient";
import { useDispatch } from "react-redux";
import { showErrorAlert } from "../store/actions/ui";
import { useIntl } from "react-intl";
/**
 * @typedef {import('../services/tradeApiClient.types').ProviderFollowersEntity} ProviderFollowersEntity
 * @typedef {import('../services/tradeApiClient.types').DefaultProviderGetObject} DefaultProviderGetObject
 * @typedef {import('../services/tradeApiClient.types').ProviderEntity} ProviderEntity
 * @typedef {import("../components/CustomSelect/CustomSelect").OptionType} OptionType
 *
 * @typedef {Object} FilterObject
 * @property {String} connected
 * @property {String} active
 * @property {String} suspended
 * @property {String} connectedExchange
 *
 * @typedef {Object} HookData
 * @property {Boolean} loading
 * @property {Array<ProviderFollowersEntity>} list
 * @property {Function} loadFollowersList
 * @property {Array<OptionType>} connectedOptions
 * @property {Array<OptionType>} activeOptions
 * @property {Array<OptionType>} suspendedOptions
 * @property {Array<OptionType>} exchangeOptions
 * @property {React.SetStateAction<*>} setFilters
 * @property {FilterObject} filters
 * @property {Boolean} filtersVisibility
 * @property {React.SetStateAction<*>} setFiltersVisibility
 */

/**
 *
 * @param {DefaultProviderGetObject | ProviderEntity} provider Provider ID.
 * @returns {HookData} Hook Data.
 */
const useProviderUsers = (provider) => {
  const [allUser, setAllUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filtersVisibility, setFiltersVisibility] = useState(false);
  const intl = useIntl();
  const initialFilters = {
    connected: "ALL",
    active: "ALL",
    suspended: "ALL",
    connectedExchange: "ALL",
  };
  const [filters, setFilters] = useState(initialFilters);
  const dispatch = useDispatch();

  const connectedOptions = [
    {
      val: "true",
      label: intl.formatMessage({
        id: "fil.connected",
      }),
    },
    {
      val: "false",
      label: intl.formatMessage({
        id: "fil.notconnected",
      }),
    },
    {
      val: "ALL",
      label: intl.formatMessage({
        id: "fil.all",
      }),
    },
  ];

  const activeOptions = [
    {
      val: "true",
      label: intl.formatMessage({
        id: "fil.active",
      }),
    },
    {
      val: "false",
      label: intl.formatMessage({
        id: "fil.notactive",
      }),
    },
    {
      val: "ALL",
      label: intl.formatMessage({
        id: "fil.all",
      }),
    },
  ];

  const suspendedOptions = [
    {
      val: "true",
      label: intl.formatMessage({
        id: "fil.suspended",
      }),
    },
    {
      val: "false",
      label: intl.formatMessage({
        id: "fil.notsuspended",
      }),
    },
    {
      val: "ALL",
      label: intl.formatMessage({
        id: "fil.all",
      }),
    },
  ];

  const exchangeOptions = [
    {
      val: "true",
      label: intl.formatMessage({
        id: "fil.realexchange",
      }),
    },
    {
      val: "false",
      label: intl.formatMessage({
        id: "fil.demoexchange",
      }),
    },
    {
      val: "ALL",
      label: intl.formatMessage({
        id: "fil.all",
      }),
    },
  ];

  /**
   *
   * @param {Array<ProviderFollowersEntity>} response User list from response.
   * @return {Void} None.
   */
  const filterUsers = (response) => {
    /**
     *
     * @param {String} value String value
     * @returns {Boolean} Converted to boolean
     */
    const getBooleanValue = (value) => {
      return value === "true";
    };
    const filtered = response.filter(
      (item) =>
        (!filters.connected ||
          filters.connected === "ALL" ||
          item.connected === getBooleanValue(filters.connected)) &&
        (!filters.active ||
          filters.active === "ALL" ||
          item.active === getBooleanValue(filters.active)) &&
        (!filters.suspended ||
          filters.suspended === "ALL" ||
          item.suspended === getBooleanValue(filters.suspended)) &&
        (!filters.connectedExchange ||
          filters.connectedExchange === "ALL" ||
          item.realExchangeConnected === getBooleanValue(filters.connectedExchange)),
    );

    setFilteredUsers(filtered);
  };

  const loadFollowersList = () => {
    if (provider.id && provider.isAdmin) {
      setLoading(true);
      const payload = {
        providerId: provider.id,
      };
      tradeApi
        .providerFollowersListGet(payload)
        .then((response) => {
          setAllUsers(response);
          filterUsers(response);
          setLoading(false);
        })
        .catch((e) => {
          dispatch(showErrorAlert(e));
          setLoading(false);
        });
    }
  };

  useEffect(loadFollowersList, []);

  // Filter users on filter change
  useEffect(() => {
    if (allUser.length) {
      filterUsers(allUser);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, allUser]);

  return {
    loading,
    list: filteredUsers,
    loadFollowersList,
    setFilters,
    connectedOptions,
    activeOptions,
    suspendedOptions,
    exchangeOptions,
    filters,
    filtersVisibility,
    setFiltersVisibility,
  };
};

export default useProviderUsers;
