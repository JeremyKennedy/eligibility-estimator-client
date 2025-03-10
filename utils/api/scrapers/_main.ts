import LegalValuesScraper from './legalValuesScraper'
import Tbl1SingleScraper from './tbl1SingleScraper'
import Tbl2PartneredAndOasScraper from './tbl2PartneredAndOasScraper'
import Tbl3PartneredNoOasScraper from './tbl3PartneredNoOasScraper'
import Tbl4PartneredAlwScraper from './tbl4PartneredAlwScraper'
import Tbl5PartneredAfsScraper from './tbl5PartneredAfsScraper'

const legalValuesScraper = new LegalValuesScraper()
legalValuesScraper.main().then(() => {})

const tbl1SingleScraper = new Tbl1SingleScraper()
tbl1SingleScraper.main().then(() => {})

const tbl2PartneredAndOasScraper = new Tbl2PartneredAndOasScraper()
tbl2PartneredAndOasScraper.main().then(() => {})

const tbl3PartneredNoOasScraper = new Tbl3PartneredNoOasScraper()
tbl3PartneredNoOasScraper.main().then(() => {})

const tbl4PartneredAlwScraper = new Tbl4PartneredAlwScraper()
tbl4PartneredAlwScraper.main().then(() => {})

const tbl5PartneredAfsScraper = new Tbl5PartneredAfsScraper()
tbl5PartneredAfsScraper.main().then(() => {})
