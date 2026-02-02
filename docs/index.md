# LIDR Documentation

Select your language / Selecciona tu idioma:

- [🇬🇧 English](/en/)
- [🇪🇸 Español](/es/) *(Coming soon / Próximamente)*

---

<style>
.language-selector {
  display: flex;
  gap: 2rem;
  justify-content: center;
  margin: 3rem 0;
}
.language-selector a {
  padding: 1.5rem 3rem;
  border: 2px solid var(--vp-c-brand-1);
  border-radius: 8px;
  text-decoration: none;
  font-size: 1.2rem;
  transition: all 0.3s;
}
.language-selector a:hover {
  background: var(--vp-c-brand-1);
  color: white;
}
</style>

<script setup>
// Auto-redirect to English (default)
if (typeof window !== 'undefined' && window.location.pathname === '/') {
  window.location.href = '/en/'
}
</script>
