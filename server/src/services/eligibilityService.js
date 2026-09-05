const labels={category:'Category',state:'State',domicileState:'Domicile',course:'Course',branch:'Branch',educationLevel:'Education level',academicYear:'Academic year',gender:'Gender',minorityStatus:'Minority status',disabilityStatus:'Disability status',annualIncome:'Annual family income',percentage:'Previous percentage',cgpa:'CGPA'};
const value=(p,f)=>p[f];
export function evaluateEligibility(profile, scholarship){
  const reasons=[], failures=[];
  for(const rule of scholarship.eligibility){
    const actual=value(profile,rule.field), label=rule.label||labels[rule.field]||rule.field;
    if(actual===null||actual===undefined||actual===''){ if(rule.required) failures.push(`${label}: add this to your profile to check`); continue; }
    let ok=true, detail='matches'; const accepted=Array.isArray(rule.values)?rule.values:[];
    if(rule.operator==='IN'){ ok=accepted.length===0||accepted.map(String).map(x=>x.toLowerCase()).includes(String(actual).toLowerCase()); detail=`${actual} ${ok?'matches':'does not match'} ${accepted.join(', ')}`; }
    if(rule.minValue!==null&&rule.minValue!==undefined){ok=ok&&Number(actual)>=rule.minValue;detail=`${actual} ${Number(actual)>=rule.minValue?'meets':'is below'} minimum ${rule.minValue}`}
    if(rule.maxValue!==null&&rule.maxValue!==undefined){ok=ok&&Number(actual)<=rule.maxValue;detail=`${actual} ${Number(actual)<=rule.maxValue?'is within':'exceeds'} maximum ${rule.maxValue}`}
    (ok?reasons:failures).push(`${label}: ${detail}`);
  }
  return {eligible:failures.length===0,matchReasons:reasons,unmetCriteria:failures};
}
