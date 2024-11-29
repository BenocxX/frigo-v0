<script lang="ts">
  import { Button } from '$lib/components/ui/button/index.js';

  let { data } = $props();
</script>

<p>{data.user.role}</p>
<Button>Click me</Button>
