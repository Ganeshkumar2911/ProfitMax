import { makeRequest } from "@/request/requests"
import { defineStore } from "pinia"
import { ref, watch } from "vue"

export const useOrderStore = defineStore('orders', () => {

    const endpoint = 'orders'

    // state
    const orders = ref([])
    const currentPage = ref(1)
    const totalPages = ref(1)
    const totalBuyTrades = ref(0)
    const totalSellTrades = ref(0)
    const loading = ref(false);
    const editData = ref(null)

    // query params (single source of truth)
    const params = ref({
        type: 'OPEN',
        search: '',
        page: 1,
    })

    // actions
    const getOrders = async () => {

        loading.value = true
        try {
            // build clean query params
            const cleanParams = Object.fromEntries(
                Object.entries(params.value).filter(([_, value]) => {
                    if (value === null || value === undefined) return false
                    if (typeof value === 'string' && value.trim() === '') return false
                    return true
                })
            )

            const res = await makeRequest(
                endpoint,
                'GET',
                {},
                {},
                cleanParams
            )

            if (res?.data) {
                orders.value = res.data.orders || []
                currentPage.value = res.data.page || 1
                totalPages.value = res.data.total_page || 1
                totalBuyTrades.value = res.data.total_buy_trades || 0
                totalSellTrades.value = res.data.total_sell_trades || 0
            }
        } catch (error) {
            console.log('error in order store', error)
        } finally {
            loading.value = false
        }
    }


    const placeOrders = async (form) => {
        try {
            if (editData.value) {
                const res = await makeRequest(endpoint, 'PUT', form, {}, {}, {}, editData.value.id)
                if (res.data) {
                    editData.value = null;
                    showAddEditModal.value = false;
                }

            }
            const res = await makeRequest(endpoint, 'POST', form)
            if (res.data) {
                return res
            }
        } catch (error) {
            console.log('error in orderstore', error);
        }
    }


    getOrders()
    return {
        // state
        orders,
        currentPage,
        totalPages,
        totalBuyTrades,
        totalSellTrades,
        loading,
        params,
        editData,

        // actions
        getOrders,
        placeOrders
    }
})
