import { Injectable } from '@angular/core';
import { FieldConfig, DialogConfig } from './field-config.interface';

@Injectable({
  providedIn: 'root'
})
export class DialogConfigService {

  getKorisnikConfig(data?: any, isNew: boolean = false): DialogConfig {
    return {
      title: isNew ? 'Dodaj Novog Korisnika' : 'Izmeni Korisnika',
      isNew,
      data,
      fields: [
        {
          name: 'korisnickoIme',
          label: 'Korisničko ime',
          type: 'text',
          required: true,
          placeholder: 'Unesite korisničko ime'
        },
        {
          name: 'email',
          label: 'Email',
          type: 'email',
          required: true,
          placeholder: 'Unesite email'
        },
        {
          name: 'ime',
          label: 'Ime',
          type: 'text',
          required: true,
          placeholder: 'Unesite ime'
        },
        {
          name: 'prezime',
          label: 'Prezime',
          type: 'text',
          required: true,
          placeholder: 'Unesite prezime'
        },
        {
          name: 'lozinka',
          label: 'Lozinka',
          type: 'password',
          required: true,
          placeholder: 'Unesite lozinku',
          minLength: 6,
          showOnNew: true, 
          fullWidth: true
        },
        {
          name: 'datumRodjenja',
          label: 'Datum rođenja',
          type: 'date',
          fullWidth: true
        }
      ],
      customProcessing: (formValue: any, isNewUser: boolean) => {
       
        if (formValue.datumRodjenja !== undefined) {
          delete formValue.datumRodjenja;
        }
        
       
        if (!isNewUser && (formValue.lozinka === undefined || formValue.lozinka === null || formValue.lozinka === '')) {
          delete formValue.lozinka;
        }
        
        
        if (!formValue.ime) formValue.ime = '';
        if (!formValue.prezime) formValue.prezime = '';
        
        console.log('Form value being processed:', formValue);
        return formValue;
      }
    };
  }

  getStudijskiProgramConfig(data?: any, isNew: boolean = false, fakulteti?: any[], nastavnici?: any[]): DialogConfig {
    return {
      title: isNew ? 'Dodaj Studijski Program' : 'Izmeni Studijski Program',
      isNew,
      data,
      fields: [
        {
          name: 'naziv',
          label: 'Naziv',
          type: 'text',
          required: true,
          placeholder: 'Unesite naziv studijskog programa',
          fullWidth: true
        },
        {
          name: 'fakultetId',
          label: 'Fakultet',
          type: 'select',
          required: true,
          options: fakulteti?.map(f => ({ value: f.id, label: f.naziv })) || []
        },
        {
          name: 'rukovodilaId',
          label: 'Rukovodilac',
          type: 'select',
          required: true,
          options: nastavnici?.map(n => ({ 
            value: n.id, 
            label: `${n.ime} ${n.prezime}` 
          })) || []
        }
      ]
    };
  }

  getFakultetConfig(data?: any, isNew: boolean = false): DialogConfig {
    return {
      title: isNew ? 'Dodaj Fakultet' : 'Izmeni Fakultet',
      isNew,
      data,
      fields: [
        {
          name: 'naziv',
          label: 'Naziv',
          type: 'text',
          required: true,
          placeholder: 'Unesite naziv fakulteta',
          fullWidth: true
        },
        {
          name: 'opis',
          label: 'Opis',
          type: 'textarea',
          placeholder: 'Unesite opis fakulteta',
          fullWidth: true
        }
      ]
    };
  }

  getNastavnikConfig(data?: any, isNew: boolean = false): DialogConfig {
    return {
      title: isNew ? 'Dodaj Nastavnika' : 'Izmeni Nastavnika',
      isNew,
      data,
      fields: [
        {
          name: 'ime',
          label: 'Ime',
          type: 'text',
          required: true,
          placeholder: 'Unesite ime'
        },
        {
          name: 'prezime',
          label: 'Prezime',
          type: 'text',
          required: true,
          placeholder: 'Unesite prezime'
        },
        {
          name: 'email',
          label: 'Email',
          type: 'email',
          required: true,
          placeholder: 'Unesite email',
          fullWidth: true
        },
        {
          name: 'biografija',
          label: 'Biografija',
          type: 'textarea',
          placeholder: 'Unesite biografiju nastavnika',
          fullWidth: true
        }
      ]
    };
  }

  getZaposleniConfig(data?: any, isNew: boolean = false, tip: 'nastavnik' | 'studentska_sluzba' | 'student' = 'nastavnik'): DialogConfig {
    const title = isNew ? 
      (tip === 'nastavnik' ? 'Dodaj Nastavnika' : 
       tip === 'student' ? 'Dodaj Studenta' : 'Dodaj Člana Studentske Službe') :
      (tip === 'nastavnik' ? 'Izmeni Nastavnika' : 
       tip === 'student' ? 'Izmeni Studenta' : 'Izmeni Člana Studentske Službe');

    const baseFields: FieldConfig[] = [
      {
        name: 'korisnickoIme',
        label: 'Korisničko ime',
        type: 'text',
        required: true,
        placeholder: 'Unesite korisničko ime'
      },
      {
        name: 'email',
        label: 'Email',
        type: 'email',
        required: true,
        placeholder: 'Unesite email'
      },
      {
        name: 'ime',
        label: 'Ime',
        type: 'text',
        required: true,
        placeholder: 'Unesite ime'
      },
      {
        name: 'prezime',
        label: 'Prezime',
        type: 'text',
        required: true,
        placeholder: 'Unesite prezime'
      },
      {
        name: 'lozinka',
        label: 'Lozinka',
        type: 'password',
        required: true,
        placeholder: 'Unesite lozinku',
        minLength: 6,
        fullWidth: true
      }
    ];

    
    if (tip === 'nastavnik') {
      baseFields.push(
        {
          name: 'jmbg',
          label: 'JMBG',
          type: 'text',
          required: true,
          placeholder: 'Unesite JMBG',
          fullWidth: true
        },
        {
          name: 'biografija',
          label: 'Biografija',
          type: 'textarea',
          placeholder: 'Unesite biografiju nastavnika',
          fullWidth: true
        },
        {
          name: 'tipZvanjaNaziv',
          label: 'Tip Zvanja',
          type: 'text',
          placeholder: 'Unesite tip zvanja (npr. docent, vanredni profesor)'
        },
        {
          name: 'naucnaOblastNaziv',
          label: 'Naučna Oblast',
          type: 'text',
          placeholder: 'Unesite naučnu oblast (npr. Informatika, Matematika)'
        },
        {
          name: 'datumIzbora',
          label: 'Datum Izbora',
          type: 'date',
          fullWidth: true
        },
        {
          name: 'datumPrestanka',
          label: 'Datum Prestanka',
          type: 'date',
          fullWidth: true
        }
      );
    }
    
    
    if (tip === 'student') {
      baseFields.push(
        {
          name: 'jmbg',
          label: 'JMBG',
          type: 'text',
          required: true,
          placeholder: 'Unesite JMBG',
          fullWidth: true
        },
        {
          name: 'ulica',
          label: 'Ulica',
          type: 'text',
          placeholder: 'Unesite naziv ulice'
        },
        {
          name: 'broj',
          label: 'Broj',
          type: 'text',
          placeholder: 'Unesite broj'
        },
        {
          name: 'nazivMesta',
          label: 'Mesto',
          type: 'text',
          placeholder: 'Unesite naziv mesta'
        },
        {
          name: 'nazivDrzave',
          label: 'Država',
          type: 'text',
          placeholder: 'Unesite naziv države'
        }
      );
    }

    return {
      title,
      isNew,
      data,
      fields: baseFields
    };
  }

  
}
