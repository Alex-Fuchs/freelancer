import { Component } from '@angular/core';
import {DataService} from "../data.service";
import {Modal} from "bootstrap";

@Component({
  selector: 'app-face-enhancer',
  templateUrl: './face-enhancer.component.html',
  styleUrls: ['./face-enhancer.component.css']
})
export class FaceEnhancerComponent {

  preview: string = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEBLAEsAAD/4QBvRXhpZgAASUkqAAgAAAADAA4BAgAlAAAAMgAAAB' +
    'oBBQABAAAAVwAAABsBBQABAAAAXwAAAAAAAABWZWN0b3IgZ3JhcGhpYyBvZiBubyB0aHVtYm5haWwgc3ltYm9sLAEAAAEAAAAsAQAAAQAAAP/' +
    'hBaFodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlk' +
    'Ij8+Cjx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iPgoJPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xO' +
    'Tk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4KCQk8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczpwaG90b3Nob3A9Imh0dHA6Ly' +
    '9ucy5hZG9iZS5jb20vcGhvdG9zaG9wLzEuMC8iIHhtbG5zOklwdGM0eG1wQ29yZT0iaHR0cDovL2lwdGMub3JnL3N0ZC9JcHRjNHhtcENvcmU' +
    'vMS4wL3htbG5zLyIgICB4bWxuczpHZXR0eUltYWdlc0dJRlQ9Imh0dHA6Ly94bXAuZ2V0dHlpbWFnZXMuY29tL2dpZnQvMS4wLyIgeG1sbnM6' +
    'ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIiB4bWxuczpwbHVzPSJodHRwOi8vbnMudXNlcGx1cy5vcmcvbGRmL3htcC8xL' +
    'jAvIiAgeG1sbnM6aXB0Y0V4dD0iaHR0cDovL2lwdGMub3JnL3N0ZC9JcHRjNHhtcEV4dC8yMDA4LTAyLTI5LyIgeG1sbnM6eG1wUmlnaHRzPS' +
    'JodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvcmlnaHRzLyIgcGhvdG9zaG9wOkNyZWRpdD0iR2V0dHkgSW1hZ2VzIiBHZXR0eUltYWdlc0d' +
    'JRlQ6QXNzZXRJRD0iMTE0NzU0NDgwNyIgeG1wUmlnaHRzOldlYlN0YXRlbWVudD0iaHR0cHM6Ly93d3cuaXN0b2NrcGhvdG8uY29tL2xlZ2Fs' +
    'L2xpY2Vuc2UtYWdyZWVtZW50P3V0bV9tZWRpdW09b3JnYW5pYyZhbXA7dXRtX3NvdXJjZT1nb29nbGUmYW1wO3V0bV9jYW1wYWlnbj1pcHRjd' +
    'XJsIiBwbHVzOkRhdGFNaW5pbmc9Imh0dHA6Ly9ucy51c2VwbHVzLm9yZy9sZGYvdm9jYWIvRE1JLVBST0hJQklURUQtRVhDRVBUU0VBUkNIRU' +
    '5HSU5FSU5ERVhJTkciID4KPGRjOmNyZWF0b3I+PHJkZjpTZXE+PHJkZjpsaT5QYXRyaWNrIERheGVuYmljaGxlcjwvcmRmOmxpPjwvcmRmOlN' +
    'lcT48L2RjOmNyZWF0b3I+PGRjOmRlc2NyaXB0aW9uPjxyZGY6QWx0PjxyZGY6bGkgeG1sOmxhbmc9IngtZGVmYXVsdCI+VmVjdG9yIGdyYXBo' +
    'aWMgb2Ygbm8gdGh1bWJuYWlsIHN5bWJvbDwvcmRmOmxpPjwvcmRmOkFsdD48L2RjOmRlc2NyaXB0aW9uPgo8cGx1czpMaWNlbnNvcj48cmRmO' +
    'lNlcT48cmRmOmxpIHJkZjpwYXJzZVR5cGU9J1Jlc291cmNlJz48cGx1czpMaWNlbnNvclVSTD5odHRwczovL3d3dy5pc3RvY2twaG90by5jb2' +
    '0vcGhvdG8vbGljZW5zZS1nbTExNDc1NDQ4MDctP3V0bV9tZWRpdW09b3JnYW5pYyZhbXA7dXRtX3NvdXJjZT1nb29nbGUmYW1wO3V0bV9jYW1' +
    'wYWlnbj1pcHRjdXJsPC9wbHVzOkxpY2Vuc29yVVJMPjwvcmRmOmxpPjwvcmRmOlNlcT48L3BsdXM6TGljZW5zb3I+CgkJPC9yZGY6RGVzY3Jp' +
    'cHRpb24+Cgk8L3JkZjpSREY+CjwveDp4bXBtZXRhPgo8P3hwYWNrZXQgZW5kPSJ3Ij8+Cv/tAHBQaG90b3Nob3AgMy4wADhCSU0EBAAAAAAAV' +
    'BwCUAAUUGF0cmljayBEYXhlbmJpY2hsZXIcAngAJVZlY3RvciBncmFwaGljIG9mIG5vIHRodW1ibmFpbCBzeW1ib2wcAm4ADEdldHR5IEltYW' +
    'dlc//bAEMACgcHCAcGCggICAsKCgsOGBAODQ0OHRUWERgjHyUkIh8iISYrNy8mKTQpISIwQTE0OTs+Pj4lLkRJQzxINz0+O//CAAsIAmQCZAE' +
    'BEQD/xAAZAAEBAQEBAQAAAAAAAAAAAAAABAMCAQb/2gAIAQEAAAAB+iAAAAAAAAAAAADMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA' +
    'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA' +
    'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA' +
    'AAAAAAAAAAAAAAAAAAAOnIAAAAAAAAAAAe6a6e+QgAAAAAAAAAAe96a9AkzAAAAAAAAAAO9NNB5xlzT1hOAAAAAAAAAHWmmno4zy4FG/EYAAA' +
    'AAAAAHummnQ5zzz8A0rQ+AAAAAAAAPe9NOx5nnnye6M/B7clyAAAAAAADvTTQM88+ALO3EYV6YzAAAAAAAdaaaeh5nwAOthjyNNOcRnwAAAAA' +
    'CjXoAAAAABxGAAAAAHtxln7Qy8AAAADX3mIAAAAAFneMzanmIAAAAG1PMQAAAAAKN85G1PEYAAB7t1jwG1PMQAAAAANK0Pm1PEYAABZ2R8Dan' +
    'mIAAAAAHtyTPaniMAAB1aMJxtTzEAAAAABXphPtTxGAAA9uE2I2p5iAAAAAA3o4j2p4jAAANafcpvBtTzEAAAAAB3Yh1p4jDXebgAA98BtTzE' +
    'AAAAAAu9l9p4jHtvqXIAAA2p5iAAAAAAVa48U8RjegYTnu+XAADanmIAAAAABtTzhTxGe2+hnL5RunwAA2p5iAAAAAAdWp6OIyjcDzHccS8gB' +
    'tTzEAAAAAAW9Z6cRurQABPgANqeYgAAAAACnY4jVagABxLyA2p5iAAAAAANajiPq0AABNiBtTzEAAAAAAe3HEe9AAABnNyG1PMQAAAAAAs7cR' +
    '0bgAADyfEbU8xAAAAAACjdxHvQAAADOXxtTzEAAAAAANK3EfuvoAAAOM21PMQAAAAAA9ueReAAAABTtzEAAAAAAFegAAAAA5iAAAAAADakAAA' +
    'AAZyAAAAAAA9AAAAAHgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA' +
    'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA' +
    'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB//EACUQAAEDBAICAwEBAQAA' +
    'AAAAAAABAhIDERMyEFAgITAxQGCgQv/aAAgBAQABBQKbibibibibibibibibibibibibibibibibibibibibibibibibibibibibibibibibi' +
    'bibibibibibibibibibibibibibibibibibibibibibibibibibibibibibibibibibibibibibibibibibibibv9QkVUVFT+IsqmNTGhZE4V' +
    'Lp/CQUxkUTzft38VUxkE8bmRDIpNwi3Qqd5FVMamNC1vGaGQmq+NPh+vb2uY1MaEUTxkiGQmvws27aCmMiieN0QyIZFLqvjjUxr8L9uviqmMg' +
    'nlNDISVfga23Lm38malT66uyqY1MaFkTy9lnGNTGpjUxqY1MamNTGpjUxqIyy+DmXXGpjUxqY1GtjwqXTGpjUxqY1FaqdKlMiidO7Xp8iGRRi' +
    'qruFqIZDIZDIZDIZDIZDIZDIZDIZDIZDIZDIZDIZDIZDIZDIZBFvw7XpG+2lT64p7Dtf3U/sdr0lPh+vFPYdr+X7EpmNBWqnlT2Ha9Izbwp7D' +
    'tfytbZOXJZfCnsO16d+xT2Ha/kT78KnjT2Ha9KzUqcU9h2v5fvwqL78Kew7XpafD9SnsO1/K11i9+HPt5U9h2vSt9O4X7p7DtfFjbisQVtvz0' +
    '9h2vTJ7QqbU9h2viiWQ+xzLfmp7Dtemp6lT6p7DtfCmni5njjFaqfPT2Ha9NT+x3ttPYdryntU9J4ubcVLcU05dT+ansO16ZvpeG+njteaafA' +
    'qXMfi5qKK1U+SnsO16dvtD/sdrwiXX8Dqfx09h2vT0/rl2vFNPX4XNRRUVPhp7Dtenp7cu1Gpdfx/Y5nwU9h2vTp6Xl2pT+/yuZcVLeVPYdr1' +
    'DfbeHalP89rjmW8aew7XqKfLtSn+lzLipbmnsO16hm3DtRFsZFMhkMhkMhkMhkMhkMhkMhkMhkMhkMhkMhkMhkHOlzT2Ha9WqXRUt+6m3h2vU' +
    's16J2vU016N6+uqupdS6l1LqXUupdS6l1LqXUupdS6l1LqXUupdS6l1LqXUupdS6l1LqXUupdS6l1/1Zf/EAB8QAQEAAgEFAQEAAAAAAAAAAD' +
    'EAAVAgEBEhMEBgoP/aAAgBAQAGPwJmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZn+oQvP4s/EMfhy859nfeHp8Y5dt6cX' +
    '8H5zH4cvOfS789TMzMzMzPNmZ69pmZ03mNPnXEREREREREREREREREREdc6zOhzpe3PPz+Z9OdZnQ51mfqxzzqO/DP1duedN25Z+nx6M6zOhz' +
    'rM6HOszx78fHF+LOsz7u/Xx8GdVnpnh39L8mdZn5PHtzrM9e/wB2dZn5/HqzrM6HOsz0z9HjnnU9uuemfvzrM8CIiIiIiIiIiIiIiI5Z/F9+m' +
    'fxudV2/HMzMzMzMzMzMzMzMzMzMzMzP9WX/xAAoEAACAgAFBAICAwEAAAAAAAAAARFhECAhMVFBUHGhMECRsWCB4aD/2gAIAQEAAT8htlstls' +
    'tlstlstlstlstlstlstlstlstlstlstlstlstlstlstlstlstlstlstlstlstlstlstlstlstlstlstlstlstlstlstlstlstlstlstlstlst' +
    '/9Qi2TGyv4QtgmxN30Erdti2iYSC/giTeyE/pHkS9Qs+JD/wBGL/IJfSfJEbZGi3cDTY+koNbc17Bdu+FsmF1nAk76iTYoybDT1nwP/YPqvxl' +
    'ffAkvXeE2xSJu+gus2xbBMr3wa9EN/WBtvdz8DQt4boahtdzSb2E/pHkX+QWXHvGho2ljbtCHvG8m+wm0NPDGo3yrRyJypwWPLuCMTgl9J8iS' +
    'WyyNpbuBrsb9FA918BC3ihbNsrz44LofbFtGE7dpCTvqLYJLM+Ef2N/SvBQKhUKhUKhUKhUKg9LbWVrWmioVCoVB0pe+E2KhUKhUN57KqJ/AW' +
    'yTs+vsktGsZjcadtRs2SRrhzpig4SkiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiI8haysPW7K8GDuCx/Vhp+/b/jD1uyvo8Cz4Y/q+xkm' +
    '0I5RxMeN5zb3jD1uyvC3g1KaNnh+r7G808dzT+mXe8Yet2VOHInKnBIe8P1fX2tfOXblb3jD1uzPK1gu2D9X18nDkThKyTJwy73jD1uzPq8CS' +
    '+H6vsbbvYSbHOCdGpjcucu94w9bszwYpDLg/V8Gky9kMraBz6/Qlvrn3vGHrdnaB4JHkfqz5KXCIpYNJIYzWtV9be8Yet2dphxguh8H6s+1Z/' +
    'wBZev8AjkSlwhaddRvP5+fe8Yet2d9a5wSRH6s2SBISBLMmrGNDw6v+sGp3Op+Pzb3jD1uztC8VhZtoz/r4ErDN/AShQslK+Rzr8m94w9btDQ' +
    'vCInysuikJQo+dpNQyDX8fj3vGHrdofWuMOuXQ8j+lSse6/DveMPW7Q0Q5zaDX1GkkMatdS+De8Yet2hoHxmy6n9ZGvZjXhrNveMPW7S8H3NN' +
    'Ehobq1LLveMPW7S+jytv+yRrWjGNDWO94w9btLwt5cxpRUifAnwJ8CfAnwJ8CfAnwJ8CfAnwJ8CfAnwJ8CfAnwJ8CfAnwJ8CfAnwJ8BqQ0sd7' +
    'xh63aVo5E5U4SC5GNDX3mLVh63anla7H63akptuvY1p11fa7BYLBYLBYLBYLBYLBYLBYLBYLBYLBYLBYLBYLBYLBYLBYLBYLBY/6sv/aAAgBA' +
    'QAAABAAAAAAAAAAAAAH/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/w' +
    'D/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8' +
    'A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/' +
    'AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/' +
    'wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP' +
    '8A/wD/AP8A/wD/AP8A/wD/AP8A/wC//wD/AP8A/wD/AP8A/wD/AOf/AP8A/wD/AP8A/wD/AP8A2/f/AP8A/wD/AP8A/wD/AP73v/8A/wD/AP8' +
    'A/wD/AP8A8f3/AP8A/wD/AP8A/wD/APw/p/8A/wD/AP8A/wD+/hw8v/8A/wD/AP8A/wD3D+/1/wD/AP8A/wD/AP8A+ADwMH//AP8A/wD/AP8A' +
    '/wD/AP8A/wD/AP8A/wD/ALHAAAAAX/8A/wD/AP8Atf8A/wD/AP7/AP8A/wD/AP2//wD/AK/X/wD/AP8A/wDl/wD/AP3+v/8A/wD/APyv/wD/A' +
    'N/1/wD/AP8A/wD9f/8A/n+v/wD/AP8A/wDr/wD/AP8AvX//AP8A/wD/AN/n/wD36/8A/wD/AP8A/Py//wD/AF//AP8A/wD/AOf/APH/APr/AP' +
    '8A/wD/AP8Av/8Ar/8A1/8A/wD/AP8A/wD/APXf/r//AP8A/wD/AP8AP/8AP/X/AP8A/wD/AP8Ae/8A/v8Ar/8A/wD/AP8A/wD/AP8A+/1//wD' +
    '/AP8A/wD9/wD/APvr/wD/AP8A/wD/AO//AP8A71//AP8A/wD/AP8A/wD/AP8Auv8A/wD/AP8A/wD+AAAA1/8A/wD/AP8A+X//AP8A/r//AP8A' +
    '/wD/AP8A/wD/AP8A/f8A/wD/AP8A/wD/AP8A/wD/AO//AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/A' +
    'P8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/w' +
    'D/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8' +
    'A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/' +
    'AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/' +
    'wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/8QAKxAAAgECBQ' +
    'QCAgMBAQEAAAAAAAERYfEQITFBUSBQcZGh8DBAgcHRYKCx/9oACAEBAAE/EL2XsvZey9l7L2XsvZey9l7L2XsvZey9l7L2XsvZey9l7L2XsvZ' +
    'ey9l7L2XsvZey9l7L2XsvZey9l7L2XsvZey9l7L2XsvZey9l7L2XsvZey9l7L2XsvZey9l7L2XsvZey9l7L2XsvZey9/+oTXBXQ1ZX/EfGYjX' +
    'CWuZ/lQadKxgpytUNQ2nt/wbGGN0RraJULazosjSknl5mnVDdnmu/pNuEpNOZLl5D9hUQ5uCRIRJU6Ecq8maU29EOaflmJEs9GhS1ynVcYZ/8' +
    'T75rAqOafhmbwerFUL8F0NpJbSVTn7+Q/8AsY1p0uMg225bnoy/5lhXmbvGtfgjaC1Yp/kGlCsdOkE8LMV13V5GnolENZY1X+CnMmDSYno8hz' +
    'zVOO5sIRt0RxZUL3HRDTkb5eYlGnRpW/k078Bpj5DWN5fQk2hG29kKpaXkxVKXgYxoRprZ9LNCapyKWmjU4T72Se366GnMly8h7QVEjmyoQQh' +
    'Ki6E8o8mae21EO6flma4RwsutJtpLNs03L6vHTcLoxps01DWvTHLdowl4bjtmvSsH+1Bvh6s+MxdXF8htc4yDe5bHWfxREREREPSEtl0pSE9n' +
    '0xERHENcMNsG9H0xERpqU9GuywjXL2bGkCuvZ1UjZT2R009E0zVTg0RtoS3Zph/E/wB6BjnzMZcI7orfZW+yt9lb7K32VvsrfZW+yt9lb7K32' +
    'VvsrfZW+yt9lb7K32VvsrfZW+yt9lb7K32VvsrfZW+yt9lb7L4Sd8rjs4TvdKHgolo3njq+WDNhcfvs4tn2cE/GcrCfe7Tjq+WHxP1lhLbewx' +
    'qYaIcWQdTPWp4Or6FV2cIZtkwU80agabE9Vlhq+WHxP1lJbW88WkjTUp7EsmrNdP0Krs4MQmqciEJo1OFOZlhq+WHxP1USL0adKqTeWun6FV2' +
    'gKsyYZf8AE8NXyw+J+qxCapyLTpNT0IQbM+n6FV2gPOs1hDd1msNXyw+J+tz9/gVSpKYI2xUdEMYzlvV9P0KrtATvZuHg0mmnoxjndBq+WHxO' +
    'pbk/3MgyVtmiLJls1o/zptOU2h65n5fX9Cq7QCcOUVVU4S72STV8sPidLFIltwhKXbWrweEJp7E5P8q/W+hVdpCqGjCXmoNXyw+J0zsjJZdJL' +
    'lUPf/A004ahrFikS3kjhFCHuSVsmn5/oVXaQh4LDxlkavlh8TobqJsToJLqXyvLyQ9h4a6KYEI0iaezGKcxBppw1D/L9Cq7SFFnnjTVP/7h8T' +
    'ojZGby/AirPD4EuqXCMxCEQlkuhDL8AgS5bNaP8n0KrtQVWWeH23dYfExal318CEIoSUL87EhNPZjJZi9kafi+hVdqCXksITR7rD4mObFw+P0' +
    's1/lRCl8PZ/h+hVdqCikjo+Jhwq3n4EoUL9N4SmnsyVl4N1+D6FV2oKopE5UrH4mE3CUfrSSeXkyoq89X0KrtYTvdKHj8TD+r9eKJokJODddP' +
    '0KrtYeNZrH4mDqDdpP8AZlv6VmTk8foVXawozJj8TBBfDQos3MvhfC+F8L4XwvhfC+F8L4XwvhfC+F8L4XwvhfC+F8L4XwSEEOcsfoVXawZoT' +
    'VORC00anDa2EDc0mQQQQQQQQQQQQQQQQQQQQQQQQQQQQQ+CRXEqEn2wIZvk6IXBC4IXBC4IXBC4IXBC4IXBC4IXBC4IXBC4IXBC4IXBC4IXBC' +
    '4IXBC4IXBC4IXBC4IXBC4IXbQYxC0eexyN2Eu1xKFB5LwXgvBeC8F4LwXgvBeC8F4LwXgvBeC8F4LwXgvBeC8F4LwXgvBeC8F4LwXgvA225bl' +
    '/+rH/2Q==';

  selectedFile: File | null;

  button: string = 'Enhance';
  hidden: boolean = false;

  title: string = '';
  message: string = '';

  constructor(private dataService: DataService) { }

  select(event: any) {
    this.selectedFile = event.target.files[0];

    const reader = new FileReader();

    reader.onload = (e: any) => {
      this.preview = e.target.result;
    };

    reader.readAsDataURL(this.selectedFile);
  }

  upload() {
    this.hidden = true;

    if (this.button == 'Enhance') {
      this.dataService.photo_rater(this.selectedFile).subscribe(
        data => {
          this.preview = data.image;

          if (data.error.multiple_person) {
            this.title = 'Multiple people shown';
            this.message = 'The image contains multiple people. For accurate ratings, please upload an image with' +
              ' only one person, as the presence of multiple individuals can significantly reduce rating quality.';

            const modal = new Modal(document.getElementById('modal') as HTMLElement);
            modal.show();
          } else if (data.error.no_person) {
            this.title = 'No person shown';
            this.message = 'No person is visible in the image. Please upload an image that includes a person for a rating.';

            const modal = new Modal(document.getElementById('modal') as HTMLElement);
            modal.show();
          } else {
            this.button = 'Download';
          }

          this.hidden = false;
        });
    } else {
      const blob = this.base64ToBlob(this.preview);
      const url = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.download = 'new' + this.selectedFile.name; // Filename for the downloaded file

      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      this.button = 'Enhance';
      this.hidden = false;
    }
  }

  base64ToBlob(base64: string) {
    const byteString = atob(base64.split(',')[1]);
    const mimeString = base64.split(',')[0].split(':')[1].split(';')[0];

    const byteNumbers = new Array(byteString.length);
    for (let i = 0; i < byteString.length; i++) {
      byteNumbers[i] = byteString.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: mimeString });
  }
}
