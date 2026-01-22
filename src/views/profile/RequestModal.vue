<template>
    <Modal :model-value="showRequestModal" @close="closeModal">
        <div class="p-6 space-y-5">

            <!-- HEADER -->
            <h2 class="text-lg font-semibold text-gray-900">
                {{ isDeposit ? 'Deposit Funds' : 'Withdraw Funds' }}
            </h2>

            <!-- ================= DEPOSIT ================= -->
            <template v-if="isDeposit">

                <!-- BANK DETAILS -->
                <div v-if="adminBankDetails" class="bg-gray-100 rounded-lg p-4 space-y-2 text-sm">
                    <p><strong>Account Name:</strong> {{ adminBankDetails.account_name }}</p>
                    <p><strong>Account Number:</strong> {{ adminBankDetails.account_number }}</p>
                    <p><strong>IFSC:</strong> {{ adminBankDetails.ifsc_code }}</p>
                    <p><strong>UPI ID:</strong> {{ adminBankDetails.upi }}</p>
                    <p class="text-gray-500 text-xs">
                        Maximum UPI Amount: ₹{{ adminBankDetails.amt_after_change_upi }}
                    </p>
                </div>

                <!-- LIMIT REACHED WARNING -->
                <div v-if="depositLimitReached"
                    class="bg-red-100 border border-red-300 text-red-700 text-sm rounded-lg p-3">
                    ❌ Maximum deposit amount reached for this bank account.
                </div>

                <!-- AMOUNT -->
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">
                        Amount
                    </label>
                    <input type="number" v-model="amount" placeholder="Enter deposit amount"
                        :disabled="depositLimitReached"
                        class="w-full px-3 py-2 border rounded-lg focus:outline-none border-custom-border disabled:bg-gray-200" />
                </div>

                <!-- SCREENSHOT -->
                <div class="space-y-2">
                    <label class="block text-sm font-medium text-custom-text">
                        Payment Screenshot
                    </label>

                    <div class="relative flex items-center justify-center w-full border-2 border-dashed border-custom-border rounded-lg p-4
           hover:border-custom-primary transition
           disabled:opacity-50" :class="{ 'pointer-events-none opacity-50': depositLimitReached }">
                        <!-- Hidden input -->
                        <input type="file" accept="image/*" @change="handleFileChange" :disabled="depositLimitReached"
                            class="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />

                        <!-- Content -->
                        <div class="flex flex-col items-center text-center space-y-1">
                            <img src="/svg/arrow-up-from-line.svg" alt="">

                            <p class="text-sm font-medium text-custom-text">
                                Click to upload or drag & drop
                            </p>

                            <p class="text-xs text-custom-grey">
                                PNG, JPG up to 5MB
                            </p>
                        </div>
                    </div>

                    <p v-if="depositLimitReached" class="text-xs text-custom-red">
                        Deposit limit reached. Upload disabled.
                    </p>
                </div>


            </template>

            <!-- ================= WITHDRAW ================= -->
            <template v-else>

                <!-- AMOUNT -->
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">
                        Amount
                    </label>
                    <input type="number" v-model="withdraw.amount" placeholder="Enter withdrawal amount"
                        class="w-full px-3 py-2 border rounded-lg focus:outline-none border-custom-border" />
                </div>

                <!-- UPI MOBILE -->
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">
                        UPI Mobile (optional)
                    </label>
                    <input type="text" v-model="withdraw.upi_mobile" placeholder="Enter UPI linked mobile"
                        class="w-full px-3 py-2 border rounded-lg focus:outline-none border-custom-border" />
                </div>

                <!-- ACCOUNT NAME -->
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">
                        Account Name
                    </label>
                    <input type="text" v-model="withdraw.account_name" placeholder="Account holder name"
                        class="w-full px-3 py-2 border rounded-lg focus:outline-none border-custom-border" />
                </div>

                <!-- ACCOUNT NUMBER -->
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">
                        Account Number
                    </label>
                    <input type="text" v-model="withdraw.account_number" placeholder="Bank account number"
                        class="w-full px-3 py-2 border rounded-lg focus:outline-none border-custom-border" />
                </div>

                <!-- IFSC -->
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">
                        IFSC Code
                    </label>
                    <input type="text" v-model="withdraw.ifsc_code" placeholder="IFSC code"
                        class="w-full px-3 py-2 border rounded-lg focus:outline-none border-custom-border" />
                </div>

            </template>

            <!-- ACTIONS -->
            <div class="flex gap-4 pt-4">
                <button class="w-full border border-custom-border text-custom-primary py-2 rounded-lg font-semibold"
                    @click="closeModal">
                    Cancel
                </button>

                <button class="w-full bg-custom-primary text-white py-2 rounded-lg font-semibold
                           disabled:opacity-50 disabled:cursor-not-allowed"
                    :disabled="loading || (isDeposit && depositLimitReached)" @click="submit">
                    {{ loading ? 'Submitting...' : 'Submit Request' }}
                </button>
            </div>

        </div>
    </Modal>
</template>

<script setup>
import Modal from '@/components/Modal.vue'
import { useWalletStore } from '@/stores/wallet'
import { storeToRefs } from 'pinia'
import { computed, ref } from 'vue'

const walletStore = useWalletStore()
const { showRequestModal, requestMode, adminBankDetails } =
    storeToRefs(walletStore)

const isDeposit = computed(() => requestMode.value === 'deposit')

/* ================= STATE ================= */

const amount = ref('')
const screenshot = ref(null)
const loading = ref(false)

const withdraw = ref({
    amount: '',
    upi_mobile: '',
    account_name: '',
    account_number: '',
    ifsc_code: '',
})

/* ================= BUSINESS RULE ================= */

const depositLimitReached = computed(() => {
    if (!adminBankDetails.value) return false
    return (
        Number(adminBankDetails.value.total_received) >=
        Number(adminBankDetails.value.amt_after_change_upi)
    )
})

/* ================= HELPERS ================= */

const closeModal = () => {
    showRequestModal.value = false
    resetForm()
}

const resetForm = () => {
    amount.value = ''
    screenshot.value = null
    withdraw.value = {
        amount: '',
        upi_mobile: '',
        account_name: '',
        account_number: '',
        ifsc_code: '',
    }
}

const handleFileChange = (e) => {
    screenshot.value = e.target.files[0]
}

/* ================= SUBMIT ================= */

const submit = async () => {
    loading.value = true
    try {
        if (isDeposit.value) {
            await submitDeposit()
        } else {
            await submitWithdraw()
        }
        closeModal()
    } finally {
        loading.value = false
    }
}

const submitDeposit = async () => {
    if (depositLimitReached.value) return
    if (!amount.value || !screenshot.value) return

    const fd = new FormData()
    fd.append('amount', amount.value)
    fd.append('bank_account_id', adminBankDetails.value.id)
    fd.append('screenshot', screenshot.value)

    await walletStore.sendRequest(fd)
}

const submitWithdraw = async () => {
    if (!withdraw.value.amount) return

    const formData = new FormData()

    formData.append('amount', withdraw.value.amount)

    if (withdraw.value.upi_mobile) {
        formData.append('upi_mobile', withdraw.value.upi_mobile)
    }

    if (withdraw.value.account_name) {
        formData.append('account_name', withdraw.value.account_name)
    }

    if (withdraw.value.account_number) {
        formData.append('account_number', withdraw.value.account_number)
    }

    if (withdraw.value.ifsc_code) {
        formData.append('ifsc_code', withdraw.value.ifsc_code)
    }

    await walletStore.sendRequest(formData)
}

</script>
