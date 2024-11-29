<script lang="ts">
  import { Button } from '$lib/components/ui/button/index.js';
  import type { PageServerData } from './$types';

  let { data }: { data: PageServerData } = $props();
</script>

<p>{data.user.username}</p>
<Button>Click me</Button>
