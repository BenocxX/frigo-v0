<script lang="ts">
  import PageTitle from '$lib/components/custom/structure/page-title.svelte';
  import { Button } from '$lib/components/ui/button';
  import { enhance } from '$app/forms';
  import * as AlertDialog from '$lib/components/ui/alert-dialog/index.js';
  import { cn } from '$lib/utils';
  import InteracImg from '$lib/assets/images/interac.png';
  import ShakepayImg from '$lib/assets/images/shakepay.png';
  import BitcoinImg from '$lib/assets/images/bitcoin.png';
  import EthereumImg from '$lib/assets/images/ethereum.png';
  import QR from '@svelte-put/qr/svg/QR.svelte';
  import { browser } from '$app/environment';
  import { makeSearchParams } from '$lib/utils/search-params';

  const { data } = $props();

  const paymentMethods = [
    { name: 'interac', label: 'Virement Interac', imgSrc: InteracImg, imgAlt: 'Interac logo' },
    { name: 'shakepay', label: 'Shakepay', imgSrc: ShakepayImg, imgAlt: 'Shakepay logo' },
    { name: 'bitcoin', label: 'Bitcoin', imgSrc: BitcoinImg, imgAlt: 'Bitcoin logo' },
    { name: 'ethereum', label: 'Ethereum', imgSrc: EthereumImg, imgAlt: 'Ethereum logo' },
  ] as const;

  type PaymentMethod = (typeof paymentMethods)[number]['name'];

  let previousSelected: PaymentMethod = 'interac';
  if (browser) {
    const storedPaymentMethod = localStorage.getItem('selectedPaymentMethod');
    previousSelected = (storedPaymentMethod as PaymentMethod) || 'interac';
  }

  let selected = $state<PaymentMethod>(previousSelected);

  function isSelected(method: PaymentMethod) {
    return selected === method;
  }

  function onSelect(method: PaymentMethod) {
    selected = method;
    localStorage.setItem('selectedPaymentMethod', method);
  }

  const debtInBtc = (data.totalDebt / data.btcPrice).toFixed(7);
  const debtInEth = (data.totalDebt / data.ethPrice).toFixed(18);
  console.log(debtInBtc, debtInEth);

  const { searchParams: btcSearchParams } = makeSearchParams({ amount: debtInBtc });
  const { searchParams: ethSearchParams } = makeSearchParams({
    value: debtInEth,
    amount: debtInEth,
  });

  console.log(btcSearchParams, ethSearchParams);

  let isOpen = $state(false);
</script>

<PageTitle
  title="Payer ma dette"
  subtitle="Choisissez un mode de paiement pour régler votre dette"
/>
<fieldset>
  <legend class="font-semibold">Sélectionnez une méthode de paiement</legend>
  <div class="my-4 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4 xl:grid-cols-4">
    {#each paymentMethods as paymentMethod}
      {@render paymentChoice({
        method: paymentMethod.name as PaymentMethod,
        label: paymentMethod.label,
        imgSrc: paymentMethod.imgSrc,
        imgAlt: paymentMethod.imgAlt,
      })}
    {/each}
  </div>
</fieldset>

<AlertDialog.Root bind:open={isOpen}>
  <AlertDialog.Trigger>
    {#snippet child({ props })}
      <Button {...props}>Procéder au paiement</Button>
    {/snippet}
  </AlertDialog.Trigger>
  <AlertDialog.Content>
    <form method="POST" use:enhance>
      <AlertDialog.Header>
        <AlertDialog.Title>Payer votre dette aux gestionnaires</AlertDialog.Title>
        <AlertDialog.Description>
          {#if isSelected('interac')}
            Pour payer votre dette par virement Interac, veuillez envoyer le montant de votre dette
            au numéro de téléphone suivant : <strong class="text-foreground">
              {data.addresses.interac}
            </strong>
          {:else if isSelected('shakepay')}
            Pour payer votre dette avec Shakepay, veuillez envoyer le montant de votre dette à
            l'utilisateur suivant : <strong class="text-foreground">
              {data.addresses.shakepay}
            </strong>
          {:else if isSelected('bitcoin')}
            Pour payer votre dette en Bitcoin, veuillez envoyer le montant de votre dette à
            l'adresse suivante :
          {:else if isSelected('ethereum')}
            Pour payer votre dette en Ethereum, veuillez envoyer le montant de votre dette à
            l'adresse suivante :
          {/if}
        </AlertDialog.Description>
      </AlertDialog.Header>
      {#if isSelected('bitcoin')}
        <div class="mt-4">
          <QR data={`bitcoin:${data.addresses.btc}${btcSearchParams}`} />
        </div>
      {:else if isSelected('ethereum')}
        <div class="mt-4">
          <QR data={`ethereum:${data.addresses.eth}${ethSearchParams}`} />
        </div>
      {/if}
      <AlertDialog.Footer class="mt-4">
        <AlertDialog.Cancel type="button">Annuler</AlertDialog.Cancel>
        <AlertDialog.Action onclick={() => (isOpen = false)}>
          Je confirme avoir payer ma dette
        </AlertDialog.Action>
      </AlertDialog.Footer>
    </form>
  </AlertDialog.Content>
</AlertDialog.Root>

{#snippet paymentChoice({
  method,
  label,
  imgSrc,
  imgAlt,
}: {
  method: PaymentMethod;
  label: string;
  imgSrc: string;
  imgAlt: string;
})}
  <button onclick={() => onSelect(method)}>
    <label
      aria-label="Virement Interac"
      class={cn(
        'relative flex cursor-pointer items-center rounded-lg border p-4 text-start shadow-sm transition-all focus:outline-none',
        isSelected(method) && 'border-primary ring-2 ring-primary'
      )}
    >
      <input type="radio" name="payment-method" value={method} class="sr-only" />
      <span class="flex flex-1 items-center gap-4">
        <img src={imgSrc} alt={imgAlt} class="size-7 rounded-full" />
        <span class="flex flex-col">
          <span class="text block font-medium">{label}</span>
        </span>
      </span>
      <svg
        class={cn(
          'size-5 text-transparent transition-colors',
          isSelected(method) && 'text-primary'
        )}
        viewBox="0 0 20 20"
        fill="currentColor"
        aria-hidden="true"
        data-slot="icon"
      >
        <path
          fill-rule="evenodd"
          d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.857-9.809a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z"
          clip-rule="evenodd"
        />
      </svg>
      <span
        class={cn(
          'pointer-events-none absolute -inset-px rounded-lg border-2 border-transparent transition-colors',
          isSelected(method) && 'border border-primary'
        )}
        aria-hidden="true"
      ></span>
    </label>
  </button>
{/snippet}
