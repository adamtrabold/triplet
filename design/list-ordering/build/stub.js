// Supabase stub for the sort harness: real Copenhagen rows (read-only snapshot, 2026-09-29), signed-in session.
// Row order = the server's created_at DESC order. Two neighborhood shapes exercise the shape block.
window.__ROWS = [
 ["mir","Mirabelle bakery","29, Guldbergsgade, Nørrebro, Copenhagen","cafe",55.692405,12.556248,"Cardamom buns and pastries."],
 ["jae","Jægersborggade","Jægersborggade, Nørrebro, Copenhagen","area",55.6912666,12.5451876,"The single best street to walk: food, ceramics, design, coffee."],
 ["cof","The Coffee Collective","57, Jægersborggade, Nørrebro, Copenhagen","cafe",55.693655,12.542404,null],
 ["ass","Assistens Cemetery","Assistens Cemetery, Nørrebro, Copenhagen","area",55.6909248,12.5494421,"H.C. Andersen and Kierkegaard’s graves, locals picnic here."],
 ["rav","Ravnsborggade","Ravnsborggade, Nørrebro, Copenhagen","shopping",55.6875571,12.5616948,"Antiques row (Veirhanen, Gyrn Antik, Ingerslev Antik)."],
 ["tor","Torvehallerne","Torvehallerne, Frederiksborggade, Indre By, Copenhagen","restaurant",55.6838669,12.5695512,"Central twin food market halls, good vegetarian options."],
 ["sup","Superkilen park","210, Nørrebrogade, Nørrebro, Copenhagen","area",55.698991,12.54212,"Giant pink octopus slide, neon signage."],
 ["kin","Keramiker Inge Vincents","43, Jægersborggade, Nørrebro, Copenhagen","shopping",55.693105,12.54306,null],
 ["ooh","Ooh Aah Records","Ryesgade, Nørrebro, Copenhagen","shopping",55.6901737,12.5640858,null],
 ["dac","da capo vintage","17, Elmegade, Nørrebro, Copenhagen","shopping",55.690032,12.558822,null],
 ["ros","Rosenborg Castle","Rosenborg Castle, Indre By, Copenhagen","attraction",55.6856935,12.5774199,"Castle & gardens."],
 ["isr","Israels Plads","Israels Plads, Indre By, Copenhagen","shopping",55.6824903,12.5683066,"Saturday flea market."],
 ["tiv","Tivoli Gardens","Tivoli Gardens, Vesterbrogade, Copenhagen","attraction",55.6734161,12.5691819,"Halloween season Oct 1 – Nov 1."],
 ["nyh","Nyhavn","Nyhavn, Indre By, Copenhagen","area",55.6799285,12.5893524,"Iconic harbor canal front."],
 ["har","Hart Bageri","Gammel Mønt, Indre By, Copenhagen","cafe",55.6812354,12.5815962,"Sourdough bakery, good kid stop."],
 ["ama","Amalienborg","Amaliegade, Indre By, Copenhagen","attraction",55.6839601,12.5930781,"Noon guard change."],
 ["kfb","Kødbyens Fiskebar","Meatpacking District, Copenhagen","restaurant",55.6676775,12.5595333,"Top-tier seafood restaurant."],
 ["mot","Mother","Høkerboderne, Meatpacking District, Copenhagen","restaurant",55.6685053,12.5576615,"Sourdough pizza, family-friendly."],
 ["ref","Reffen","Refshaleøen, Copenhagen","restaurant",55.7010478,12.6316987,"Shipping-container street food market."],
 ["jmm","Jazzhus Montmartre","Store Regnegade, Indre By, Copenhagen","bar",55.6820021,12.5824601,"Historic, atmospheric jazz club."],
 ["chr","Christiansborg Palace","Marmorbroen, Indre By, Copenhagen","attraction",55.6756505,12.5800406,"Free tower view."],
 ["gag","Gågrøn","Jægersborggade, Nørrebro, Copenhagen","shopping",55.6935481,12.5429838,null],
 ["fla","flacoDesign","53, Jægersborggade, Nørrebro, Copenhagen","shopping",55.693508,12.542634,null],
 ["lad","Ladyfingers","4, Jægersborggade, Nørrebro, Copenhagen","shopping",55.691898,12.545272,"Jewelry design collective."],
 ["pal","Palmspree","10, Stefansgade, Nørrebro, Copenhagen","shopping",55.696054,12.544256,"Contemporary record store."],
 ["sbr","Second Beat Records","Jagtvej, Nørrebro, Copenhagen","shopping",55.6989467,12.554002,null],
 ["cha","CHAMOI Vintage Store","2, Elmegade, Nørrebro, Copenhagen","shopping",55.689365,12.557999,null],
 ["lil","Lilla Torg","Lilla Torg, Malmö","area",55.6050909,12.9987743,null],
 ["dmd","Designmuseum Danmark","Bredgade, Indre By, Copenhagen","attraction",55.6863742,12.5944077,"Closed Mondays."],
 ["lng","Sankt Hans Torv to Blågårdsgade walking street","Blågårdsgade, Nørrebro, Copenhagen","area",55.6868,12.5545,"Long-name truncation case (test data)."]
].map(([id,name,address,category,lat,lng,notes]) => ({ id, name, address, category, lat, lng, notes, visited: id === 'ref', starred: id === 'cof' || id === 'tor' || id === 'pal', city: id === 'lil' ? 'malmo' : 'copenhagen' }));
window.__SHAPES = [
  { id: 'shp-vb', city: 'copenhagen', type: 'district', label: 'Vesterbro', color: null, note: null, min_zoom: null, geometry: [[55.667,12.545],[55.672,12.545],[55.672,12.560],[55.667,12.560]] },
  { id: 'shp-ist', city: 'copenhagen', type: 'street', label: 'Istedgade', color: null, note: null, min_zoom: null, geometry: [[55.669,12.553],[55.668,12.560]] },
];
(function () {
  const q = (table) => {
    const res = () => ({ data: table === 'locations' ? window.__ROWS.map(r => ({ ...r })) : table === 'neighborhood_shapes' ? window.__SHAPES.map(r => ({ ...r })) : [], error: null });
    let patch = null;
    const b = { select() { return b; }, order() { return b; }, eq(k, v) { if (patch) window.__ROWS.forEach(r => { if (r[k] === v) Object.assign(r, patch); }); return b; }, in() { return b; },
      update(o) { patch = o; return b; }, insert() { return b; }, delete() { return b; },
      then(ok, bad) { return Promise.resolve(res()).then(ok, bad); } };
    return b;
  };
  const session = { user: { email: 'adamtrabold@gmail.com' } };
  window.supabase = { createClient() { return {
    from: q,
    auth: { getSession: async () => ({ data: { session } }), onAuthStateChange(cb) { setTimeout(() => cb('INITIAL_SESSION', session), 0); return { data: { subscription: { unsubscribe() {} } } }; },
      signInWithPassword: async () => ({ data: {}, error: null }), signOut: async () => ({}) } }; } };
})();
