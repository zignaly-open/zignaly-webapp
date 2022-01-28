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
 *
 * @typedef {Object} HookData
 * @property {Boolean} loading
 * @property {Array<ProviderFollowersEntity>} list
 * @property {Function} loadFollowersList
 * @property {Array<OptionType>} connectedOptions
 * @property {Array<OptionType>} activeOptions
 * @property {Array<OptionType>} suspendedOptions
 * @property {React.SetStateAction<*>} setFilters
 * @property {FilterObject} filters
 * @property {Boolean} filtersVisibility
 * @property {React.SetStateAction<*>} setFiltersVisibility
 * @property {Number} total
 */

/**
 *
 * @param {DefaultProviderGetObject | ProviderEntity} provider Provider ID.
 * @param {PaginationOptions} paginationOptions
 * @returns {HookData} Hook Data.
 */
const useProviderUsers = (provider, paginationOptions) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filtersVisibility, setFiltersVisibility] = useState(false);
  const intl = useIntl();
  const initialFilters = {
    connected: "ALL",
    active: "ALL",
    suspended: "ALL",
  };
  const [filters, setFilters] = useState(initialFilters);
  const dispatch = useDispatch();
  const [total, setTotal] = useState(null);

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

  /**
   * @param {string} filter
   * @returns {number}
   */
  const getFilterValue = (filter) => (filter === "true" ? 1 : filter === "false" ? 0 : null);

  const loadFollowersList = () => {
    if (provider.id && provider.isAdmin) {
      setLoading(true);
      const payload = {
        providerId: provider.id,
        connected: getFilterValue(filters.connected),
        active: getFilterValue(filters.active),
        suspended: getFilterValue(filters.suspended),
        ...paginationOptions,
      };
      tradeApi
        .providerFollowersListGet(payload)
        .then((response) => {
          setUsers(response.data);
          setTotal(response.pagination.total);
          setLoading(false);
        })
        .catch((e) => {
          dispatch(showErrorAlert(e));
          setLoading(false);
        });
    }
  };

  useEffect(() => {
    loadFollowersList();
  }, [filters, paginationOptions]);

  return {
    loading,
    list: users,
    loadFollowersList,
    setFilters,
    connectedOptions,
    activeOptions,
    suspendedOptions,
    filters,
    filtersVisibility,
    setFiltersVisibility,
    total,
  };
};

export default useProviderUsers;
